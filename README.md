# Table

This project features a dynamic table component designed to seamlessly integrate data from the backend, eliminating the need to manually construct a table for every project. It leverages Inertia.js and React.js, ensuring efficient and reusable table generation for various use cases. 

1. Clone the Repository
Navigate to the Components directory and run the following command to clone the required repository:

git clone https://github.com/JoshuaHeathcote1987/Table.git

2. Prepare the Data
Organize the data to be passed into the Table component to ensure it functions as intended. Refer to the examples below for guidance.

3. Set Up the Pages
In this example, the initial page is configured as Projects, which includes the Table component.

4. Controller Configuration
The Controller class is structured as follows:

```
    public function index()
    {
        $projects = Project::all();
        $fields = [
            [
                'name' => 'name',               // The name of the field (used in the form data and as the field's key)
                'label' => 'Project Name',      // The label text to display next to the input
                'type' => 'text',               // The type of input (e.g., 'text', 'textarea', 'select', 'date')
                'value' => '',                  // The default value for the input field
                'placeholder' => 'Enter project name'  // Placeholder text inside the input field
            ],
            [
                'name' => 'description',        // The field's name for the description
                'label' => 'Description',       // The label for the description input
                'type' => 'textarea',           // Use a textarea for multi-line input
                'value' => '',                  // Default value for the textarea
                'placeholder' => 'Enter project description' // Placeholder text inside the textarea
            ],
            [
                'name' => 'status',             // The field name for the status dropdown
                'label' => 'Status',            // Label for the status dropdown
                'type' => 'select',             // Use a select input (dropdown)
                'value' => 'Active',            // The default value for the status dropdown
                'options' => ['Active', 'Completed', 'Archived'], // The options in the select dropdown
                'placeholder' => ''             // Select fields usually don't have placeholders
            ],
            [
                'name' => 'start_date',         // Name of the start date field
                'label' => 'Start Date',        // Label for the start date input
                'type' => 'date',               // Type of input (date picker)
                'value' => '',                  // Default value (empty for now)
                'placeholder' => ''             // Date fields typically don't need a placeholder
            ],
            [
                'name' => 'end_date',           // Name of the end date field
                'label' => 'End Date',          // Label for the end date input
                'type' => 'date',               // Type of input (date picker)
                'value' => '',                  // Default value (empty for now)
                'placeholder' => ''             // Date fields typically don't need a placeholder
            ]
        ];

        return Inertia::render('Projects', ['results' => $projects, 'fields' => $fields]);
    }
```

5. Page Setup
Configure the Page component to enable additional functionality tailored to specific requirements in this case `DashboardNavigation`. Using an external Page allows for greater flexibility and customization, empowering users to expand the page's capabilities as needed.

```
import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Table } from '@/Components/Table';
import { DashboardNavigation } from '@/Components/DashboardNavigation';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

// Update TableProps to use the User type for the user property
interface TableProps {
    auth: {
        user: User;
    };
    results: { [key: string]: any }[];
    fields: any[];
}

export default function Projects({ auth, results = [], fields = [] }: TableProps) {
    return (
        <PrimeReactProvider>
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
            >
                <Head title="Dashboard" />

                <DashboardNavigation />
                <Table results={results} fields={fields} />
            </AuthenticatedLayout>
        </PrimeReactProvider>
    );
}
```

After completing the setup, the Table component will render within the configured Page