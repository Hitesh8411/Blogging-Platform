import { createClient } from '@/utils/supabase'

export async function getUserRole() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) return 'Viewer' // Default role
  return data.role
}
