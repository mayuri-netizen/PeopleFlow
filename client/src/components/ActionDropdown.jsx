import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // <-- IMPORT ReactDOM for the portal
import { Link } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import './ActionDropdown.css';

const ActionDropdown = ({ userId, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 }); // To store pixel position
    const triggerRef = useRef(null); // Ref for the trigger button

    const toggleDropdown = () => {
        if (!isOpen) {
            // Calculate position when opening
            const rect = triggerRef.current.getBoundingClientRect();
            const dropdownHeight = 110; // Approximate height of our dropdown
            const spaceBelow = window.innerHeight - rect.bottom;

            let top;
            if (spaceBelow < dropdownHeight) {
                // Not enough space, open upwards
                top = rect.top + window.scrollY - dropdownHeight;
            } else {
                // Enough space, open downwards
                top = rect.bottom + window.scrollY;
            }

            // Position the menu to be right-aligned with the trigger button
            const left = rect.right + window.scrollX - 120; // 120 is the menu width from CSS

            setPosition({ top, left });
        }
        setIsOpen(!isOpen);
    };

    // Effect to handle clicks outside to close the menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            // We check the trigger ref, not a dropdown ref, since the dropdown is in a portal
            if (isOpen && triggerRef.current && !triggerRef.current.contains(event.target)) {
                // A small timeout helps prevent race conditions with the toggle click
                setTimeout(() => setIsOpen(false), 0);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    const DropdownMenu = () => (
        <div
            className="dropdown-menu"
            // Apply the calculated position using inline styles
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <Link to={`/view/${userId}`} className="dropdown-item">View</Link>
            <Link to={`/edit/${userId}`} className="dropdown-item">Edit</Link>
            <button
                onClick={() => onDelete(userId)}
                className="dropdown-item delete-action"
            >
                Delete
            </button>

        </div>
    );

    return (
        <div className="action-dropdown">
            <button className="dropdown-trigger" onClick={toggleDropdown} ref={triggerRef}>
                <FaEllipsisV />
            </button>

            {/* Use the Portal to render the dropdown menu */}
            {isOpen && ReactDOM.createPortal(
                <DropdownMenu />,
                document.getElementById('dropdown-portal')
            )}
        </div>
    );
};

export default ActionDropdown;