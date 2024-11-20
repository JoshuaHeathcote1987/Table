import React, { useState } from 'react';

interface CalendarProps {
    onDateClick?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const daysInMonth = () => {
        const days = [];
        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    };

    return (
        <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-700">&lt;</button>
                <h2 className="text-lg font-bold">
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-700">&gt;</button>
            </div>

            <div className="grid grid-cols-7 text-center text-sm font-bold text-gray-600">
                {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-2">
                {Array(startOfMonth.getDay()).fill(null).map((_, idx) => (
                    <div key={`empty-${idx}`} />
                ))}

                {daysInMonth().map((day) => (
                    <div
                        key={day.getDate()}
                        className={`flex flex-col justify-center items-center p-2 rounded-lg h-16 cursor-pointer ${day.getDate() === new Date().getDate() &&
                                currentDate.getMonth() === new Date().getMonth() &&
                                currentDate.getFullYear() === new Date().getFullYear()
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            } hover:bg-blue-200`}
                        onClick={() => onDateClick && onDateClick(day)}
                    >
                        {day.getDate()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
