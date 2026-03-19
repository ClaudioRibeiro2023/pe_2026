import { Outlet } from 'react-router-dom'
import { AreaSubnav } from '../components/AreaSubnav'
import { AreaProvider, useAreaContext } from '../contexts/AreaContext'

function PlanningAreaLayoutContent() {
  const { area, areaSlug } = useAreaContext()

  return (
    <div className="flex flex-col h-full">
      <AreaSubnav areaSlug={areaSlug} areaName={area?.name} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export function PlanningAreaLayout() {
  return (
    <AreaProvider>
      <PlanningAreaLayoutContent />
    </AreaProvider>
  )
}
