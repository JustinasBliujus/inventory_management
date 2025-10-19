import SharedNavbar from '../components/navbar';
import Button from 'react-bootstrap/esm/Button';
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
import { useLocation } from 'react-router-dom';
import { userService } from '../../api/userService';

function InventoryPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("items");
    const location = useLocation();
    const inventoryId = location.state;
    const [inventory, setInventory] = useState(null);

    const handleSave = async () => {
        if (!inventory) return;

        const customFields = Object.fromEntries(
            Object.entries(inventory).filter(([key]) => key.startsWith("custom_"))
        );

        const payload = {
            inv_id: inventory.id,
            creator_id: inventory.user_id,
            name: inventory.name,
            description: inventory.description,
            is_public: inventory.is_public,
            ...customFields
        };

        const result = await userService.saveInventory(payload);
        console.log("Inventory saved:", result.data);
        };



    useEffect(() => {
        if (!inventoryId) return;

        const fetchInventory = async () => {
            try {
                const res = await userService.getInventory(inventoryId);
                setInventory(res.data); 
            } catch (err) {
                console.error(err);
            }
        };


        fetchInventory();
    }, [inventoryId]);

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

                {inventory && (
                    <>
                        <p className="fs-1 mt-5">{inventory.name}</p>
                        <p className="mt-1">{inventory.description}</p>
                        <Button variant="success" onClick={handleSave}>
                            Save Inventory
                        </Button>
                <div className="mt-4">
                    {activeTab === "items" && <ItemsTab inventory={inventory} setInventory={setInventory} />}
                    {activeTab === "chat" && <ChatTab inventory={inventory} setInventory={setInventory} />}
                    {activeTab === "access" && <AccessTab inventory={inventory} setInventory={setInventory} />}
                    {activeTab === "stats" && <StatsTab inventory={inventory} setInventory={setInventory} />}
                    {activeTab === "settings" && <SettingsTab inventory={inventory} setInventory={setInventory} />}
                    {activeTab === "customId" && <CustomIdTab inventory={inventory} setInventory={setInventory} />}
                    {activeTab === "fields" && <FieldsTab inventory={inventory} setInventory={setInventory} />}
                </div>
                </>
                )}
            </div>
        </div>
    );
}

export default InventoryPage;
