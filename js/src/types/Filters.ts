type TaxonomyFilterProps = {
    termsByTaxonomy: Record<string, Term[]>;
    checkedState: Record<string, boolean>;
    handleFilterChange: (term: Term, checked: boolean, type?: string, lastSelectedKey?: string) => void;
}

type MetaFilterProps = {
    metaByKey: Record<string, Term[]>;
    checkedState: Record<string, boolean>;
    handleFilterChange: (term: Term, checked: boolean, type?: string, lastSelectedKey?: string) => void;
}

type FilterUIProps = {
    terms: Term[];
    checkedState: { [key: string]: boolean };
    handleFilterChange?: (term: Term, checked: boolean, type?: string, lastSelectedKey?: string) => void;
    labelType?: 'text' | 'badge';
}