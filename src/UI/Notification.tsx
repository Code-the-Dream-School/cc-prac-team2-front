import { useState, useEffect } from 'react';
import './Notification.css'; // Import the CSS file for the Notification component

const Notification = ({ message }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return isVisible ? (
        <div className="notification">
            <div className="p-5  text-lg text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                 role="alert">
                <span className="font-medium">{message}</span>
            </div>
        </div>
    ) : null;
};

export default Notification;
