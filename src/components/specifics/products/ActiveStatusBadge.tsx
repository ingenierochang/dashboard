import React from 'react'

type ActiveStatusBadgeProps = {
    active: boolean;
}

const ActiveStatusBadge = ({ active }: ActiveStatusBadgeProps) => {

    if (!active) return (
        <span
            className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
        >
            Inactivo
        </span>
    )

    return (
        <span
            className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
        >
            Activo
        </span>
    )
}

export default ActiveStatusBadge
