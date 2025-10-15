import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import './ActionDropdown.css';

const ActionDropdown = ({ userId, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 }); // To store pixel position
    const triggerRef = useRef(null); // Ref for the trigger button

    const toggleDropdown = () => {
        if (!isOpen) {

            const rect = triggerRef.current.getBoundingClientRect();
            const dropdownHeight = 110;
            const spaceBelow = window.innerHeight - rect.bottom;

            let top;
            if (spaceBelow < dropdownHeight) {

                top = rect.top + window.scrollY - dropdownHeight;
            } else {

                top = rect.bottom + window.scrollY;
            }


            const left = rect.right + window.scrollX - 120;

            setPosition({ top, left });
        }
        setIsOpen(!isOpen);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {

            if (isOpen && triggerRef.current && !triggerRef.current.contains(event.target)) {

                setTimeout(() => setIsOpen(false), 0);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    const DropdownMenu = () => (
        <div
            className="dropdown-menu"

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


            {isOpen && ReactDOM.createPortal(
                <DropdownMenu />,
                document.getElementById('dropdown-portal')
            )}
        </div>
    );
};

export default ActionDropdown;