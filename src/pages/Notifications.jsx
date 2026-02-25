import React from 'react';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    // Placeholder notifications
    const dummyNotifications = [
        {
            id: 1,
            type: 'info',
            title: 'Welcome to StyleUpSpaces!',
            message: 'Complete your profile to get personalized interior design recommendations.',
            date: 'Today, 10:30 AM',
            icon: Info,
            color: 'var(--primary-color)'
        },
        {
            id: 2,
            type: 'success',
            title: 'Enquiry Received',
            message: 'Your recent enquiry for the Whitefield property has been received. Our team will contact you soon.',
            date: 'Yesterday, 04:15 PM',
            icon: CheckCircle,
            color: '#28a745'
        },
        {
            id: 3,
            type: 'alert',
            title: 'New Offers Available',
            message: 'Check out our new festive season discounts on complete home interior packages!',
            date: '2 Days Ago',
            icon: AlertTriangle,
            color: '#ffc107'
        }
    ];

    return (
        <div className="page-wrapper notifications-page">
            
            <main className="notifications-main">
                <div className="container notifications-container">
                    <div className="notifications-header">
                        <h2>
                            <Bell className="header-icon" size={28} />
                            Your Notifications
                        </h2>
                        <button className="btn btn-outline mark-read-btn">Mark all as read</button>
                    </div>

                    <div className="notifications-list">
                        {dummyNotifications.length > 0 ? (
                            dummyNotifications.map(notification => {
                                const IconTag = notification.icon;
                                return (
                                    <div key={notification.id} className="notification-card">
                                        <div className="noti-icon-wrapper" style={{ backgroundColor: `${notification.color}15`, color: notification.color }}>
                                            <IconTag size={24} />
                                        </div>
                                        <div className="noti-content">
                                            <div className="noti-title-row">
                                                <h4>{notification.title}</h4>
                                                <span className="noti-date">{notification.date}</span>
                                            </div>
                                            <p className="noti-message">{notification.message}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-notifications">
                                <Bell size={48} color="var(--text-light)" />
                                <h3>No Notifications Yet</h3>
                                <p>When you get updates, offers, or alerts, they'll show up here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Notifications;
