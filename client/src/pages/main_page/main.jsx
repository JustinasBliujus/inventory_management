import SharedNavbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { TagCloud } from 'react-tagcloud'
import DataTable from '../components/dataTable';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../appContext';
import { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const { darkMode } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [latestInventories, setLatestInventories] = useState([]);
  const [popularInventories, setPopularInventories] = useState([]);
  const [tags, setTags] = useState([]);

  const SimpleCloud = () => (
  <div className='d-flex justify-content-center text-center'>
    <TagCloud
      minSize={12}
      maxSize={35}
      tags={tags}
      onClick={handleTagClick}
      className='d-none d-md-block w-75'
      style ={{ cursor: "pointer" }}
    />
  </div>
)
  const handleTagClick = async (tag) => {
    console.log('Tag clicked:', tag.value);

    const { data } = await userService.getInventoriesByTag(tag.id); 
    console.log('Inventories:', data.inventories);
    navigate('/search', { state: { inventories: data.inventories } });
  };

  useEffect(() => {
          const fetchData = async () => {
              try {
                  const result = await userService.getLastInventories();
                  const latest = result.data.inventories.map(inv => ({
                      ...inv,
                      id: inv.id,
                      user_id: inv.user_id,
                      name: inv.name,
                      category: inv.category,
                      description: inv.description,
                      creator: inv.user.email,
                      created: inv.createdAt             
                  }));
                  setLatestInventories(latest);
  
              } catch (err) {
                  console.error("Error fetching latest inventories:", err);
              }

              try {
                  const result = await userService.getPopularInventories();
                  const popular = result.data.inventories.map(inv => ({
                      ...inv,
                      id_pop: inv.id,
                      user_id: inv.user_id,
                      name_pop: inv.name,
                      category_pop: inv.category,
                      description_pop: inv.description,
                      creator_pop: inv.user.email,
                      itemCount_pop: inv.itemCount         
                  }));
                  setPopularInventories(popular);
  
              } catch (err) {
                  console.error("Error fetching popular inventories:", err);
              }

              try {
                  const result = await userService.getRandomTags();
                  
                  const tagNames = result.data.tags.map(tag => ({
                      id: tag.id,
                      value: tag.name,
                      count: Math.floor(Math.random() * 30) + 1
                  }));
                  setTags(tagNames);
              } catch (err) {
                  console.error("Error fetching popular inventories:", err);
              }
          };
          fetchData();
      }, []);

  const latestColumns = [
    { 
      key: 'name', label: 'Name', sortable: true, render: (value, row) => (
            <span
                style={{ cursor: 'pointer', color: '#0d6efd', }}
                onClick={() => navigate('/inventory', { state: row.id })}
            >
                {value}
            </span>
        )
    },
    { key: 'category', label: 'Category', sortable: true, render: (value) => value || '-' },
    { key: 'description', label: 'Description', sortable: true, render: (value) => value || '-' },
    { 
      key: 'creator',
      label: 'Creator',
      sortable: true, 
      className: 'd-none d-sm-table-cell', 
      render: (value, row) => (
        console.log('Render value:', value, 'Row:', row),
        <span
          className="text-decoration-none d-none d-sm-table-cell"
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate('/personal', { state: { userId: row.user_id, name: row.user.name } })}
        >
          {value}
        </span>
      ) 
    },
    { key: 'created', label: 'Created At', sortable: true, render: (value) => value || '-' },
  ];

  const popularColumns = [
    { 
      key: 'name_pop', label: 'Name', sortable: true, render: (value, row) => (
            <span
                style={{ cursor: 'pointer', color: '#0d6efd', }}
                onClick={() => navigate('/inventory', { state: row.id })}
            >
                {value}
            </span>
        )
    },
    { key: 'category_pop', label: 'Category', sortable: true, render: (value) => value || '-' },
    { key: 'description_pop', label: 'Description', sortable: true, render: (value) => value || '-' },
    { key: 'itemCount_pop', label: 'Item count', sortable: true },
    { 
      key: 'creator_pop', 
      label: 'Creator', 
      sortable: true, 
      className: 'd-none d-sm-table-cell', 
      render: (value, row) => (
        <span
          className="text-decoration-none d-none d-sm-table-cell"
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate('/personal', { state: { userId: row.user_id, name: row.user.name } })}
        >
          {value}
        </span>
      )  
    },
  ];

  return (
    <div className="vh-100">
      <SharedNavbar />
      <Container className="mt-5 p-5">
        <p className="fs-1 d-none d-md-block">{t('chooseTopic')}</p>
        {
          tags.length > 0 ? <SimpleCloud /> : <p>{t('noTagsAvailable')}</p>
        }
        <p className="fs-1 d-none d-md-block">{t('latestInventories')}</p>
        <DataTable data={latestInventories} columns={latestColumns} itemsPerPage={5} darkMode={darkMode}/>
        <p className="fs-1 d-none d-md-block">{t('mostPopularInventories')}</p>
        <DataTable data={popularInventories} columns={popularColumns} itemsPerPage={5} darkMode={darkMode}/>
      </Container>
    </div>
  );
}

export default MainPage;
