type SidebarProps = {
    searchTerm: string;
    onSearchChange: (event: string) => void;
    terms: Term[];
    onTermsFilterChange: (terms: Term[]) => void;
    selectedTerms: Term[];
}