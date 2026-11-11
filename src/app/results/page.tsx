import type { Metadata } from 'next'
import ResultsPage from '@/features/results/ResultsPage'

export const metadata: Metadata = {
  title: 'Academic Survey Results — Sudo Squad',
  description: 'Public aggregate results from the Sudo Squad academic survey.',
}

export default function PublicResultsRoute() {
  return <ResultsPage />
}
