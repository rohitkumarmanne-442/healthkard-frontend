import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_PANEL_LINKS } from './constants';
import './style.css';
import withTheme from '../../../../theme/Theme';
import ChangePassword from './ChangePassword';

function NavigationPanel({ theme, toggleTheme }) {
    const [showChangePassword, setShowChangePassword] = useState(false);

    const renderSubLink = (subLink, linkIndex, subLinkIndex) => {
        const key = `${linkIndex}-${subLinkIndex}-${subLink.label}`;

        // Handle Theme toggle button
        if (subLink.label === 'Theme') {
            return (
                <button 
                    type="button" 
                    onClick={toggleTheme} 
                    key={key} 
                    style={{ color: theme.primary }} 
                    className="flex flex-col gap-1"
                >
                    <div className="text-sm font-medium h-9 w-48 flex items-center gap-1.5 px-2 py-1 rounded">
                        <subLink.icon />
                        {subLink.label}
                    </div>
                </button>
            );
        }

        // Handle Change Password button and modal
        if (subLink.label === 'Change Password') {
            return (
                <div key={key} className="relative">
                    <button
                        type="button"
                        onClick={() => setShowChangePassword(!showChangePassword)}
                        style={{ color: theme.primary }}
                        className="text-sm font-medium h-9 w-48 flex items-center gap-1.5 px-2 py-1 rounded"
                    >
                        <subLink.icon />
                        {subLink.label}
                    </button>
                    {showChangePassword && (
                        <ChangePassword setShowChangePassword={setShowChangePassword} />
                    )}
                </div>
            );
        }

        // Regular navigation links
        return (
            <NavLink
                to={subLink.link}
                key={key}
                style={{ color: theme.primary }}
                className="text-sm font-medium h-9 w-48 flex items-center gap-1.5 px-2 py-1 rounded"
            >
                <subLink.icon />
                {subLink.label}
            </NavLink>
        );
    };

    return (
        <div 
            style={{ backgroundColor: theme.secondary }} 
            id="navigation-panel" 
            className="h-fit rounded flex flex-col gap-1 p-2"
        >
            {NAVIGATION_PANEL_LINKS.map((link, linkIndex) => (
                <div 
                    key={`link-${linkIndex}`} 
                    className="flex flex-col gap-1 p-1"
                >
                    <div 
                        style={{ color: theme.tertiary }} 
                        className="flex flex-col gap-4 text-white text-xs"
                    >
                        {link.label}
                    </div>
                    {link.subLinks.map((subLink, subLinkIndex) => 
                        renderSubLink(subLink, linkIndex, subLinkIndex)
                    )}
                </div>
            ))}
        </div>
    );
}

export default withTheme(NavigationPanel);