import React, { useState } from 'react';
import { Button } from '@/Components/Table/Components/Button';

import { FaBeer } from 'react-icons/fa';

export function DashboardNavigation() {

    const [windowLocation, setWindowLocation] = useState(window.location.pathname);

    return (
        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button title="projects" url="/dashboard/projects" />
            <Button title="tasks" url="/dashboard/tasks" />
            <Button title="meetings" url="/dashboard/meetings" />
            <Button title="timesheet" url="/dashboard/timesheets" />
            <Button title="issues" url="/dashboard/issues" />
            <Button title="risks" url="/dashboard/risks" />
        </div>
    )
}
