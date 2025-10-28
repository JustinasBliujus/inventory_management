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
import { Link } from 'react-router-dom';

function MainPage() {
  const DESCRIPTION_MAX_LENGTH = 20;
  const TAG_SIZE_MIN_SMALL_SCREEN=12;
  const TAG_SIZE_MAX_SMALL_SCREEN=20;
  const TAG_SIZE_MIN_MEDIUM_SCREEN=16;
  const TAG_SIZE_MAX_MEDIUM_SCREEN=28;
  const TAG_SIZE_MIN_BIG_SCREEN=20;
  const TAG_SIZE_MAX_BIG_SCREEN=40;
  const SMALL_SCREEN_SIZE = 578;
  const MEDIUM_SCREEN_SIZE = 768;
  const { darkMode } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [latestInventories, setLatestInventories] = useState([]);
  const [popularInventories, setPopularInventories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagSizes, setTagSizes] = useState({ min: TAG_SIZE_MIN_BIG_SCREEN, max: TAG_SIZE_MAX_BIG_SCREEN });

  useEffect(() => {
    if (window.innerWidth < SMALL_SCREEN_SIZE) { 
      setTagSizes({ min: TAG_SIZE_MIN_SMALL_SCREEN, max: TAG_SIZE_MAX_SMALL_SCREEN });
    } else if (window.innerWidth < MEDIUM_SCREEN_SIZE) { 
      setTagSizes({ min: TAG_SIZE_MIN_MEDIUM_SCREEN, max: TAG_SIZE_MAX_MEDIUM_SCREEN });
    } else { 
      setTagSizes({ min: TAG_SIZE_MIN_BIG_SCREEN, max: TAG_SIZE_MAX_BIG_SCREEN });
    }
  }, []); 

  const SimpleCloud = () => (
    <div className='d-flex justify-content-center text-center'>
      <TagCloud
        minSize={tagSizes.min}
        maxSize={tagSizes.max}
        tags={tags}
        onClick={handleTagClick}
        className='w-75'
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
  
  const handleTagClick = async (tag) => {
    const { data } = await userService.getInventoriesByTag(tag.id); 

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
        <Link
            to='/inventory'
            state={{ inventoryId: row.id }}
            className='text-decoration-none'
            relative='route'
        >
            {value}
        </Link>
        )
    },
    { key: 'category', label: 'Category', sortable: true, render: (value) => value || '-' },
    { key: 
      'description', 
      label: 'Description',
      sortable: true, 
      render: (value) => {
        if (!value) return '-';
        const maxLength = DESCRIPTION_MAX_LENGTH;
        return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
      }
    },
    { 
      key: 'creator',
      label: 'Creator',
      sortable: true, 
      render: (value, row) => (
        <Link
          className="text-decoration-none"
          relative='route'
          to='/personal'
          state={{ userId: row.user_id, name: row.user.name}}
        >
          {value}
        </Link>
      ) 
    },
    { key: 'created', label: 'Created At', sortable: true, render: (value) => value || '-' },
  ];

  const popularColumns = [
    { 
      key: 'name_pop', label: 'Name', sortable: true, render: (value, row) => (
            <Link
                to='/inventory'
                state={{ inventoryId: row.id }}
                className='text-decoration-none'
                relative='route'
            >
                {value}
            </Link>
        )
    },
    { key: 'category_pop', label: 'Category', sortable: true, render: (value) => value || '-' },
    { 
      key: 'description_pop',
      label: 'Description',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const maxLength = DESCRIPTION_MAX_LENGTH;
        return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
      }
    },
    { key: 'itemCount_pop', label: 'Item count', sortable: true },
    { 
      key: 'creator_pop', 
      label: 'Creator', 
      sortable: true, 
      render: (value, row) => (
        <Link
          className="text-decoration-none"
          to='/personal'
          relative='route'
          state={{ userId: row.user_id, name: row.user.name }}
        >
          {value}
        </Link>
      )  
    },
  ];

  return (
    <div className="vh-100">
      <SharedNavbar />
      <Container className="mt-5 p-5">
        <p className="fs-1">{t('chooseTopic')}</p>
        {
          tags.length > 0 ? <SimpleCloud /> : <p>{t('noTagsAvailable')}</p>
        }
        <p className="fs-1">{t('latestInventories')}</p>
        <DataTable data={latestInventories} columns={latestColumns} itemsPerPage={5} darkMode={darkMode}/>
        <p className="fs-1">{t('mostPopularInventories')}</p>
        <DataTable data={popularInventories} columns={popularColumns} itemsPerPage={5} darkMode={darkMode}/>
      </Container>
    </div>
  );
}

export default MainPage;
