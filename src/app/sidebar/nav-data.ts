import { last } from "rxjs";

export const navbarData = [
    {
        routeLink: 'dashboard',
        icon: 'fal fa-home',
        label: 'Dashboard'
    },
    {
        routeLink: 'entretien',
        icon: 'fal fa-list',
        label: 'Entretiens'
    },
    {
        routeLink: 'jury',
        icon: 'fal fa-gavel',
        label: 'Jurys'
    },
    {
        routeLink: 'postulant',
        icon: 'fal fa-users',
        label: 'Postulants'
    },
    // {
    //     routeLink: 'critere',
    //     icon: 'fal fa-ticket',
    //     label: 'Criteres'
    // },
    // {
    //     routeLink: 'questionnaire',
    //     icon: 'fal fa-question',
    //     label: 'Questionnaires'
    // },
    {
        routeLink: 'profile',
        icon: 'fal fa-user',
        label: 'Profiles'
    },
    {
        icon:'fas fa-sign-out',
        label:'Se deconnecter'
    }
];