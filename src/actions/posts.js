'use server'

import { createClient } from '@/utils/supabase/server'
import { generateSummary } from '@/lib/google-ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'Admin' && profile.role !== 'Author') throw new Error('Unauthorized')

  const title = formData.get('title')
  const body = formData.get('body')
  const image_url = formData.get('image_url')
  const summary = await generateSummary(body)

  const { error } = await supabase
    .from('posts')
    .insert([{ title, body, image_url, summary, author_id: user.id }])

  if (error) throw error
  revalidatePath('/blog')
  redirect('/blog')
}

export async function updatePost(id, formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: post } = await supabase.from('posts').select('author_id').eq('id', id).single()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (post.author_id !== user.id && profile.role !== 'Admin') throw new Error('Unauthorized')

  const title = formData.get('title')
  const body = formData.get('body')
  const image_url = formData.get('image_url')
  const summary = await generateSummary(body)

  const { error } = await supabase
    .from('posts')
    .update({ title, body, image_url, summary })
    .eq('id', id)

  if (error) throw error
  revalidatePath(`/blog/${id}`)
  redirect(`/blog/${id}`)
}

export async function deletePost(id) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: post } = await supabase.from('posts').select('author_id').eq('id', id).single()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    if (post.author_id !== user.id && profile.role !== 'Admin') throw new Error('Unauthorized')

    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error

    revalidatePath('/blog')
    redirect('/blog')
}
