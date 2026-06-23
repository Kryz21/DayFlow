// Supabase Edge Function: generate-day-plan
// Deploy with: supabase functions deploy generate-day-plan
// Set secret: supabase secrets set GEMINI_API_KEY=your_key_here

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

type TaskInput = {
  title: string
  notes?: string
  category?: string
  priority?: string
  completed?: boolean
}

type HabitInput = {
  title: string
  target_per_week?: number
}

type PlannerRequest = {
  date?: string
  tasks?: TaskInput[]
  habits?: HabitInput[]
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

function fallbackPlan(tasks: TaskInput[] = [], habits: HabitInput[] = []) {
  const openTasks = tasks.filter((task) => !task.completed).slice(0, 5)
  const blocks = []
  const slots = [
    ['08:30', '09:30'],
    ['10:00', '11:00'],
    ['12:00', '12:45'],
    ['16:30', '17:30'],
    ['18:30', '19:00']
  ]

  if (!openTasks.length) {
    blocks.push({
      title: 'Plan the day with intention',
      start_time: '09:00',
      end_time: '09:30',
      category: 'Personal',
      priority: 'Medium'
    })
  }

  openTasks.forEach((task, index) => {
    const [start, end] = slots[index] ?? ['20:00', '20:30']
    blocks.push({
      title: task.title,
      start_time: start,
      end_time: end,
      category: task.category || 'Other',
      priority: task.priority || 'Medium'
    })
  })

  habits.slice(0, 2).forEach((habit, index) => {
    blocks.push({
      title: `Habit: ${habit.title}`,
      start_time: index === 0 ? '07:45' : '21:00',
      end_time: index === 0 ? '08:00' : '21:15',
      category: 'Personal',
      priority: 'Low'
    })
  })

  return {
    summary: 'Fallback plan generated. Add a Gemini key to unlock smarter planning.',
    blocks
  }
}

function extractJson(text: string) {
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first === -1 || last === -1) throw new Error('Gemini did not return JSON.')
  return JSON.parse(text.slice(first, last + 1))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const body = (await req.json()) as PlannerRequest
    const tasks = body.tasks ?? []
    const habits = body.habits ?? []
    const date = body.date ?? new Date().toISOString().slice(0, 10)
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash'

    if (!geminiKey) {
      return jsonResponse(fallbackPlan(tasks, habits))
    }

    const prompt = `
You are DayFlow, a premium productivity planner.
Create a realistic day plan for date ${date}.
Use these tasks and habits. Prioritize unfinished High priority tasks.
Keep blocks realistic and not overloaded.
Return ONLY valid JSON with this shape:
{
  "summary": "one clean sentence",
  "blocks": [
    {
      "title": "string",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "category": "Study | Fitness | Personal | Work | Creative | Other",
      "priority": "Low | Medium | High"
    }
  ]
}
Tasks: ${JSON.stringify(tasks)}
Habits: ${JSON.stringify(habits)}
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: 1200,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return jsonResponse({
        ...fallbackPlan(tasks, habits),
        warning: `Gemini request failed: ${errorText.slice(0, 240)}`
      })
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return jsonResponse(fallbackPlan(tasks, habits))
    }

    const plan = extractJson(text)
    if (!Array.isArray(plan.blocks)) {
      throw new Error('Planner response did not include blocks.')
    }

    return jsonResponse(plan)
  } catch (error) {
    return jsonResponse({ error: error.message || 'Planner failed.' }, 500)
  }
})
