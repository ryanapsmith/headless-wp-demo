import React from 'react';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import LayoutProps from '../types/LayoutProps';

const Layout = ({ loadingState, posts, searchTerm, onSearchChange, terms, onTermsFilterChange, selectedTerms, loadMore, hasMore, loadingMore }: LayoutProps) => {
    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 360px) 1fr',
    };
    return (
        <div className="container" style={gridContainerStyle}>
            <>
                <Sidebar
                    searchTerm={searchTerm}
                    terms={terms}
                    onSearchChange={onSearchChange}
                    onTermsFilterChange={onTermsFilterChange}
                    selectedTerms={selectedTerms}
                />
                <Content posts={posts} loadingState={loadingState} loadMore={loadMore} hasMore={hasMore} loadingMore={loadingMore} />
            </>
        </div>
    );
};

export default Layout;