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
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../appContext';
import { Container } from 'react-bootstrap';

function InventoryPage() {
    const { darkMode } = useAppContext();

    const { t } = useTranslation();
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
                console.log(res.data)
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
        <div>
        <SharedNavbar />
        <div className='position-relative top-0 start-0'>
            {/* Mobile nav */}
                {isMobile && (
                    <div className='position-relative top-0 start-0'>
                        <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className={`justify-content-around mb-3 ${darkMode ? 'nav-tabs-dark' : ''}`}>
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
                    <div className='position-relative top-0 start-0'>
                        <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className={`justify-content-around mb-3 ${darkMode ? 'nav-tabs-dark' : ''}`}>
                            <Nav.Item><Nav.Link eventKey="items">{t('items')}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="chat">{t('chat')}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="settings">{t('settings')}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="customId">{t('customId')}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="fields">{t('fields')}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="access">{t('access')}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="stats">{t('stats')}</Nav.Link></Nav.Item>
                        </Nav>
                    </div>
                )}
        </div>
        <Container className='vh-100 d-flex flex-column align-items-start'>
                {inventory && (
                    <>
                        <p className="fs-1 mt-5">{inventory.name}</p>
                        <p className="mt-1">{inventory.description}</p>
                        <Button variant="success" onClick={handleSave}>
                            {t('saveInventory')}
                        </Button>
                <div className="mt-4 container-fluid">
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
        </Container>
        </div>
    );
}

export default InventoryPage;
