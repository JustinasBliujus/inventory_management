import SharedNavbar from '../components/navbar';
import Nav from 'react-bootstrap/Nav';
import { useState, useEffect } from 'react';
import { FaBox, FaComments, FaCog, FaIdCard, FaListAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import ChatTab from './tabs/chatTab';
import ItemsTab from './tabs/itemsTab';
import AccessTab from './tabs/accessTab';
import StatsTab from './tabs/statsTab';
import SettingsTab from './tabs/settingsTab';
import FieldsTab from './tabs/fields/fieldsTab';
import CustomIdTab from './tabs/customId/customIdTab';

function InventoryPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("items");
    
    // const [messages, setMessages] = useState();
    // const [name, setName]
    // const [description, setDescription]
    // const [fields, setFields]
    // const [access, setAccess]


    const inv = {
            name: "Golfing",
            description: "Best golf sticks and accessories",
            created: 2022,
            items: [
        {
            id: 1,
            name: "Laptop",
            brand: "Dell",
            price: 1200,
            rating: 4.5,
            quantity: 8,
            creator: "Alice@gmail.com",
            description: "High-performance laptop suitable for work and gaming.",
            imageUrl: "https://source.unsplash.com/400x300/?laptop"
        },
        {
            id: 2,
            name: "Desktop PC",
            brand: "HP",
            price: 950,
            rating: 4.2,
            quantity: 5,
            creator: "Bob@gmail.com",
            description: "Reliable desktop computer with powerful specs for productivity.",
            imageUrl: "https://media.istockphoto.com/id/1560833158/photo/game-controller-with-purple-lit-keyboard-amidst-various-wireless-devices.jpg?s=1024x1024&w=is&k=20&c=PZT8aGwdWUm6urdT1cuUGqk2zbw2yGVjXokIslte8Tc="
        },
        {
            id: 3,
            name: "Gaming Laptop",
            brand: "Asus",
            price: 1800,
            rating: 4.8,
            quantity: 3,
            creator: "Alice@gmail.com",
            description: "High-end gaming laptop with advanced graphics and speed.",
            imageUrl: "https://source.unsplash.com/400x300/?gaming,laptop"
        },
        {
            id: 4,
            name: "Monitor",
            brand: "Samsung",
            price: 300,
            rating: 4.4,
            quantity: 12,
            creator: "Bob@gmail.com",
            description: "27-inch full HD monitor with vivid colors and fast response.",
            imageUrl: "https://source.unsplash.com/400x300/?monitor,screen"
        },
        {
            id: 5,
            name: "Keyboard",
            brand: "Logitech",
            price: 80,
            rating: 4.6,
            quantity: 20,
            creator: "Alice@gmail.com",
            description: "Mechanical keyboard with comfortable keys and backlight.",
            imageUrl: "https://source.unsplash.com/400x300/?keyboard,computer"
        }
    ],
        editors: [
            { email: "alice@gmail.com", name: "Alice" },
            { email: "bob@gmail.com", name: "Bob" },
            { email: "char@gmail.com", name: "Charlie" }
        ]
    };


    const handleSelect = (eventKey) => setActiveTab(eventKey);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='vh-100 d-flex flex-column align-items-center'>
            <SharedNavbar />
            <div className='mt-5 h-100 w-75 pt-3'>
                {/* Mobile nav */}
                {isMobile && (
                    <div style={{ position: 'fixed', top: 60, left: 0, width: '100%', zIndex: 1000 }}>
                        <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className="justify-content-around mb-3">
                            <Nav.Item><Nav.Link eventKey="items"><FaBox size={15} /></Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="chat"><FaComments size={15} /></Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="settings"><FaCog size={15} /></Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="customId"><FaIdCard size={15} /></Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="fields"><FaListAlt size={15} /></Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="access"><FaUsers size={15} /></Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="stats"><FaChartBar size={15} /></Nav.Link></Nav.Item>
                        </Nav>
                    </div>
                )}

                {/* Desktop nav */}
                {!isMobile && (
                    <div className="d-flex justify-content-center">
                        <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                            <Nav.Item><Nav.Link eventKey="items">Items</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="chat">Chat</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="settings">Settings</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="customId">Custom ID</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="fields">Fields</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="access">Access</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="stats">Stats</Nav.Link></Nav.Item>
                        </Nav>
                    </div>
                )}

                <p className="fs-1 mt-5">{inv.name} Inventory</p>
                <div className="mt-4">
                    {activeTab === "items" && <ItemsTab itemsData={inv.items} />}
                    {activeTab === "chat" && <ChatTab />}
                    {activeTab === "access" && <AccessTab itemsData={inv.editors}/>}
                    {activeTab === "stats" && <StatsTab itemsData={inv.items}/>}
                    {activeTab === "settings" && <SettingsTab itemsData={inv}/>}
                    {activeTab === "customId" && <CustomIdTab/>}
                    {activeTab === "fields" && <FieldsTab/>}
                </div>
            </div>
        </div>
    );
}

export default InventoryPage;
