import { getTeamForSettings, updateTeam } from './actions'
import { SettingsForm } from './settings-form'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const team = await getTeamForSettings()
  if (!team) redirect('/dashboard')

  return <SettingsForm team={team} updateTeam={updateTeam} />
}