import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { CreatePost } from './pages/CreatePost';
import { PostDetails } from './pages/PostDetails';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';
import { mockPosts } from './data/mockData';
import { Post } from './types';

type Page = 'dashboard' | 'calendar' | 'create' | 'post-details' | 'ai-assistant' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setCurrentPage('post-details');
  };

  const handleBackFromDetails = () => {
    setSelectedPost(null);
    setCurrentPage('calendar');
  };

  const handleEdit = () => {
    alert('Edit functionality would open the create/edit form');
    setCurrentPage('create');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      alert('Post deleted!');
      handleBackFromDetails();
    }
  };

  const handleDuplicate = () => {
    alert('Post duplicated!');
  };

  const handleReschedule = () => {
    alert('Reschedule functionality would open a date picker');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'calendar':
        return <CalendarPage posts={mockPosts} onPostClick={handlePostClick} />;
      case 'create':
        return <CreatePost />;
      case 'post-details':
        return selectedPost ? (
          <PostDetails
            post={selectedPost}
            onBack={handleBackFromDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onReschedule={handleReschedule}
          />
        ) : null;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;
