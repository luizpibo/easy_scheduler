# Introdução

 Agenda de tarefas diaria utilizando next.js e firebase.
 A agenda contará com um sistema de login utilizando o email do google.

# Como iniciar o projeto

 baixe o projeto

 baixe as dependencias

# Tecnologias

Next.js

Typescript 

NextAuth

tailwind

React calendar 

Firebase

# Casos de uso

- Login com o email do google;
- Selecionar dia/semana/mes no calendário;
- Adicionar tarefa;
- Editar tarefa;
- Deletar tarefa;
- Vizualizar tarefas por dia, semana e mes;


# Modelos do banco de dados


```js
User: {
    userId: string;
    username: string;
    email: string;
    createDate: dateTime;
    authToken: string;
}

Calendar: {
    calendarId: string;
    userId: string;
    dailyTasks: [
        Task:{}
    ];
    businessDayTasks: [
        Task:{}
    ];
    finishedTasks: [
        Task:{}
    ];
    tasksOfTheDay: [
        Task:{}
    ]
    futureTasks: [
        Task:{}
    ]
}

Task:{
    taskId: string;
    title: string;
    description: string;
    startDate: date;
    endDate: date;
    startTime: time;
    durationTimeInMinutes: int;
    finished: boolean;
}

```