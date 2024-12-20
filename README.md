﻿**🚀 Dynamic Table Component**

  

This project introduces a dynamic table component that integrates seamlessly with backend data, reducing the need for manual table construction. Built using Inertia.js and React.js, this component provides a reusable and efficient solution for various data display needs.

  

**📋 Features**

  

 - Dynamic Backend Integration: Easily fetch and display backend data.
   
 - Reusable Design: Customize for multiple projects without repetitive  
   coding.

   
   

 - Efficient Setup: Streamline development with pre-built structures.

  

**🛠️ Setup Instructions**

1️⃣ *Clone the Repository*

  

Navigate to the Components directory and run the following command:

  

git clone https://github.com/JoshuaHeathcote1987/Table.git

  

*2️⃣ Prepare the Data*

  

Organize your data to pass into the Table component. Here’s an example of the structure to use:


    public  function  index()
    
    {
    
    $projects = Project::all();
    
    $fields = [
    
    [
    
    'name' => 'name', // The name of the field (used in the form data and as the field's key)
    
    'label' => 'Project Name', // The label text to display next to the input
    
    'type' => 'text', // The type of input (e.g., 'text', 'textarea', 'select', 'date')
    
    'value' => '', // The default value for the input field
    
    'placeholder' => 'Enter project name'  // Placeholder text inside the input field
    
    ],
    
    [
    
    'name' => 'description', // The field's name for the description
    
    'label' => 'Description', // The label for the description input
    
    'type' => 'textarea', // Use a textarea for multi-line input
    
    'value' => '', // Default value for the textarea
    
    'placeholder' => 'Enter project description'  // Placeholder text inside the textarea
    
    ],
    
    [
    
    'name' => 'status', // The field name for the status dropdown
    
    'label' => 'Status', // Label for the status dropdown
    
    'type' => 'select', // Use a select input (dropdown)
    
    'value' => 'Active', // The default value for the status dropdown
    
    'options' => ['Active', 'Completed', 'Archived'], // The options in the select dropdown
    
    'placeholder' => ''  // Select fields usually don't have placeholders
    
    ],
    
    [
    
    'name' => 'start_date', // Name of the start date field
    
    'label' => 'Start Date', // Label for the start date input
    
    'type' => 'date', // Type of input (date picker)
    
    'value' => '', // Default value (empty for now)
    
    'placeholder' => ''  // Date fields typically don't need a placeholder
    
    ],
    
    [
    
    'name' => 'end_date', // Name of the end date field
    
    'label' => 'End Date', // Label for the end date input
    
    'type' => 'date', // Type of input (date picker)
    
    'value' => '', // Default value (empty for now)
    
    'placeholder' => ''  // Date fields typically don't need a placeholder
    
    ]
    
    ];
    
      
    
    return  Inertia::render('Projects', ['results' => $projects, 'fields' => $fields]);
    
    }

  

*3️⃣ Set Up the Page*

  

Use an external page (e.g., DashboardNavigation) to enhance functionality and expand capabilities.

  

    import React from 'react';
    
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
    
    import { Head } from '@inertiajs/react';
    
    import { Table } from '@/Components/Table';
    
    import { DashboardNavigation } from '@/Components/DashboardNavigation';
    
      
    
    export default function Projects({ auth, results = [], fields = [] }: TableProps) {
    
    return (
    
    <AuthenticatedLayout
    
    user={auth.user}
    
    header={<h2  className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
    
    >
    
    <Head  title="Dashboard"  />
    
    <DashboardNavigation />
    
    <Table  results={results}  fields={fields}  />
    
    </AuthenticatedLayout>
    
    );
    
    }

  

**✅ Final Step**

  

Once everything is set up, the Table component will render within the configured page, ready to display your data dynamically.


**💡 Key Benefits**

  

 - Time-Saving: Eliminate repetitive table creation.
 - Scalability: Perfect for expanding projects.
 - Flexibility: Highly customizable to meet specific requirements.

  

**🌟 Contribute**

  

We welcome contributions! Feel free to fork the repo, make changes, and submit a pull request.

  

Happy Coding! 🎉

