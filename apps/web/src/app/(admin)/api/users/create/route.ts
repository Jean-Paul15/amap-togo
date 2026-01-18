// API Route : Creation utilisateur avec Supabase Auth
// Utilise service_role_key pour creer des comptes cote serveur

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Cree un client Supabase admin (service_role)
 * Doit etre appele dans la fonction, pas au niveau module
 */
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

interface CreateUserBody {
  email: string
  password: string
  nom: string
  prenom: string
  telephone?: string
  role_id: string
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body: CreateUserBody = await request.json()

    // Validation basique
    if (!body.email || !body.password || !body.nom || !body.prenom || !body.role_id) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit faire au moins 8 caracteres' },
        { status: 400 }
      )
    }

    // Verifier que le role existe
    const { data: role, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('id', body.role_id)
      .single()

    if (roleError || !role) {
      return NextResponse.json(
        { error: 'Role invalide' },
        { status: 400 }
      )
    }

    // Creer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    })

    if (authError) {
      console.error('Auth error:', authError)
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Cet email est deja utilise' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Erreur lors de la creation du compte' },
        { status: 500 }
      )
    }

    // Creer le profil
    const { error: profilError } = await supabaseAdmin
      .from('profils')
      .insert({
        id: authData.user.id,
        email: body.email,
        nom: body.nom,
        prenom: body.prenom,
        telephone: body.telephone || null,
        role_id: body.role_id,
        actif: true,
      })

    if (profilError) {
      console.error('Profil error:', profilError)
      // Supprimer l'utilisateur auth si le profil echoue
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Erreur lors de la creation du profil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: body.email,
      },
    })
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
