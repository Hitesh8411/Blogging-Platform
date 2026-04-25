'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId, newRole) {
  // 1. Verify that the CURRENT user is an Admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'Admin') {
    throw new Error('Forbidden: Only Admins can modify roles.')
  }

  // 2. Perform the update using the Service Role to bypass RLS
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    throw new Error('Failed to update user role: ' + error.message)
  }

  revalidatePath('/admin')
}
