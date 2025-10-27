import SharedNavbar from '../components/navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
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
  const { darkMode, user } = useAppContext();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const location = useLocation();
  const inventoryId = location.state?.inventoryId;
  const [inventory, setInventory] = useState(null);
  const [saved, setSaved] = useState(true); 
  const isAdmin = user?.is_admin === true;
  const isOwner = (user?.id && inventory?.user_id && user.id === inventory.user_id && user?.status === 'verified') || isAdmin;
  const MS_TILL_SAVE = 9000;

  const handleSave = async () => {

    if (!inventory) return;

    try {
      const customFields = Object.fromEntries(
        Object.entries(inventory).filter(([key]) => key.startsWith("custom_"))
      );

      const payload = {
        inv_id: inventory.id,
        creator_id: inventory.user_id,
        name: inventory.name,
        description: inventory.description,
        is_public: inventory.is_public,
        category: inventory.category,
        ...customFields
      };

      await userService.saveInventory(payload);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save inventory:", err);
      setSaved(false);
    }

    try {
      const tagNames = inventory.tags.map(tag => (typeof tag === 'string' ? tag : tag.name));
      await userService.saveTags({ tags: tagNames, inventoryId: inventory.id });
    } catch (err) {
      console.error("Failed to save tags:", err);
      setSaved(false);
    }

    try {
        await userService.saveCustomID(inventory.customID);

      } catch (err) {
        console.error(err);
      }

    try{
      const editors = inventory.editors;

      userService.addEditor(editors,inventory.id);
    }
    catch{
      console.error("error updating editors")
    }
  };

  useEffect(() => {
    if (!inventoryId) return;

    const fetchInventory = async () => {
      try {
        const res = await userService.getInventory(inventoryId);
        setInventory(res.data);
        setSaved(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInventory();
  }, [inventoryId]);

    useEffect(() => {
    if (!inventory) return;

    if (saved) return;

    const timeoutId = setTimeout(async () => {
        try {
        await handleSave();
        } catch (err) {
        console.error("Auto-save failed:", err);
        } 
    }, MS_TILL_SAVE); 

    return () => clearTimeout(timeoutId);

    }, [inventory]); 


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
          <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className={`justify-content-around mb-3 ${darkMode ? 'nav-tabs-dark' : ''}`}>
            <Nav.Item><Nav.Link eventKey="items"><FaBox size={15} /></Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="chat"><FaComments size={15} /></Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="settings" disabled={!isOwner}><FaCog size={15} /></Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="customId" disabled={!isOwner}><FaIdCard size={15} /></Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="fields" disabled={!isOwner}><FaListAlt size={15} /></Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="access" disabled={!isOwner}><FaUsers size={15} /></Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="stats" disabled={!isOwner}><FaChartBar size={15} /></Nav.Link></Nav.Item>
          </Nav>
        )}

        {/* Desktop nav */}
        {!isMobile && (
          <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className={`justify-content-around mb-3 ${darkMode ? 'nav-tabs-dark' : ''}`}>
            <Nav.Item><Nav.Link eventKey="items">{t('items')}</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="chat">{t('chat')}</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="settings" disabled={!isOwner}>{t('settings')}</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="customId" disabled={!isOwner}>{t('customId')}</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="fields" disabled={!isOwner}>{t('fields')}</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="access" disabled={!isOwner}>{t('access')}</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="stats" disabled={!isOwner}>{t('stats')}</Nav.Link></Nav.Item>
          </Nav>
        )}
      </div>

      <Container className='vh-100 d-flex flex-column align-items-start'>
        {inventory && (
          <>
            <div className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                <div className="d-flex align-items-center flex-wrap">
                    <h2 className="mb-0 me-3">{inventory.name}</h2>
                    {
                      isOwner && (
                        <Badge bg={saved ? "success" : "warning"} text="light" className="me-3" title={t('savingInfo')}>
                            {saved ? t('saved') : t('unsaved')}
                        </Badge>
                      )
                    }
                </div>
            </div>


            <p className="mt-1">{inventory.description}</p>

            {
              isOwner && (
                <Button variant="success" onClick={handleSave} className="mb-3">
                    {t('saveInventory')}
                </Button>
              )
            }

            <div className="mt-4 container-fluid">
              {activeTab === "items" && <ItemsTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
              {activeTab === "chat" && <ChatTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
              {activeTab === "access" && <AccessTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
              {activeTab === "stats" && <StatsTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
              {activeTab === "settings" && <SettingsTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
              {activeTab === "customId" && <CustomIdTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
              {activeTab === "fields" && <FieldsTab inventory={inventory} setInventory={setInventory} setSaved={setSaved} />}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default InventoryPage;
