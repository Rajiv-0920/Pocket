import React from 'react';
import Header from './components/Header';
import { useState } from 'react';
import AddModal from './components/AddModal';
import { loadLayout } from './library/utils';
import MainContent from './components/MainContent';
import { useEffect } from 'react';
import { LAYOUT_KEY } from './library/constants';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [layout, setLayout] = useState(() => loadLayout());
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_KEY, layout);
    } catch {}
  }, [layout]);

  return (
    <div className="min-h-screen bg-[#f6f6f3] dark:bg-zinc-900 transition-colors duration-300">
      <Header
        onModalOpen={setModalOpen}
        layout={layout}
        setLayout={setLayout}
        setActiveTag={setActiveTag}
        activeTag={activeTag}
        search={search}
        setSearch={setSearch}
      />
      <MainContent
        activeTag={activeTag}
        layout={layout}
        setActiveTag={setActiveTag}
        setModalOpen={setModalOpen}
        search={search}
        setSearch={setSearch}
      />
      {modalOpen && <AddModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default App;
