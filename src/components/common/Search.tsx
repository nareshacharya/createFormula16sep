import { useState, useMemo, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { Icon } from "../icons";

export interface SearchFilter {
  key: string;
  label: string;
  type: "text" | "select" | "multiSelect" | "range" | "boolean";
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  placeholder?: string;
}

export interface SearchItem {
  id: string;
  [key: string]: any;
}

export interface SearchResult<T = SearchItem> {
  items: T[];
  totalCount: number;
  filteredCount: number;
}

export interface SearchProps<T = SearchItem> {
  items: T[];
  onSearch?: (result: SearchResult<T>) => void;
  onSelectionChange?: (selectedItems: T[], selectedIds: Set<string>) => void;
  searchFields: string[];
  placeholder?: string;
  filters?: SearchFilter[];
  allowMultiSelect?: boolean;
  isMultiSelectMode?: boolean;
  selectedIds?: Set<string>;
  excludeIds?: Set<string>;
  renderItem?: (item: T, isSelected: boolean, isExcluded: boolean) => ReactNode;
  renderEmptyState?: (searchTerm: string, hasFilters: boolean) => ReactNode;
  renderSelectionControls?: (
    selectedCount: number,
    filteredCount: number,
    onSelectAll: () => void,
    onClearAll: () => void
  ) => ReactNode;
  className?: string;
  maxHeight?: string;
  debounceMs?: number;
  autoFocus?: boolean;
  showItemCount?: boolean;
  itemCountLabel?: string;
}

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SearchInputContainer = styled.div`
  position: relative;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 36px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const FilterControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
`;

const FilterInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const SelectionModeBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
  font-size: 14px;
`;

const SelectionActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SelectionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 6px 12px;
  border: 1px solid
    ${(props) => (props.variant === "primary" ? "#3b82f6" : "#d1d5db")};
  border-radius: 4px;
  background: ${(props) => (props.variant === "primary" ? "#3b82f6" : "white")};
  color: ${(props) => (props.variant === "primary" ? "white" : "#374151")};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.variant === "primary" ? "#2563eb" : "#f3f4f6"};
    border-color: ${(props) =>
      props.variant === "primary" ? "#2563eb" : "#9ca3af"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div<{ $maxHeight?: string }>`
  flex: 1;
  overflow-y: auto;
  max-height: ${(props) => props.$maxHeight || "none"};
  padding-top: 16px;
`;

const ItemCountBadge = styled.div`
  padding: 8px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DefaultItemContainer = styled.div<{
  $isSelected: boolean;
  $isExcluded: boolean;
}>`
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  cursor: ${(props) => (props.$isExcluded ? "default" : "pointer")};
  background: ${(props) => {
    if (props.$isExcluded) return "#f9fafb";
    if (props.$isSelected) return "#eff6ff";
    return "white";
  }};
  border-left: ${(props) => {
    if (props.$isExcluded) return "3px solid #10b981";
    if (props.$isSelected) return "3px solid #3b82f6";
    return "3px solid transparent";
  }};
  opacity: ${(props) => (props.$isExcluded ? 0.7 : 1)};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => {
      if (props.$isExcluded) return "#f9fafb";
      return props.$isSelected ? "#dbeafe" : "#f8fafc";
    }};
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  font-size: 14px;
`;

function Search<T extends SearchItem>({
  items,
  onSearch,
  onSelectionChange,
  searchFields,
  placeholder = "Search...",
  filters = [],
  allowMultiSelect = false,
  isMultiSelectMode = false,
  selectedIds = new Set(),
  excludeIds = new Set(),
  renderItem,
  renderEmptyState,
  renderSelectionControls,
  className,
  maxHeight,
  debounceMs = 300,
  autoFocus = false,
  showItemCount = true,
  itemCountLabel = "items",
}: SearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    filters.forEach((filter) => {
      initial[filter.key] = filter.defaultValue || "";
    });
    return initial;
  });
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(
    new Set()
  );

  // Use controlled selectedIds if provided, otherwise use local state
  const currentSelectedIds =
    selectedIds.size > 0 ? selectedIds : localSelectedIds;

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger search callback if provided
      if (onSearch) {
        onSearch(searchResult);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, filterValues, items, debounceMs, onSearch]);

  // Filter and search logic
  const searchResult = useMemo(() => {
    let filtered = [...items];

    // Apply text search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const filter = filters.find((f) => f.key === key);
      if (!filter) return;

      filtered = filtered.filter((item) => {
        const itemValue = item[key];

        switch (filter.type) {
          case "text":
            return (
              itemValue &&
              itemValue.toString().toLowerCase().includes(value.toLowerCase())
            );
          case "select":
            return itemValue === value;
          case "multiSelect":
            return Array.isArray(value) && value.includes(itemValue);
          case "boolean":
            return Boolean(itemValue) === Boolean(value);
          case "range":
            // Assuming value is { min, max }
            if (
              typeof value === "object" &&
              value.min !== undefined &&
              value.max !== undefined
            ) {
              const numValue = parseFloat(itemValue);
              return numValue >= value.min && numValue <= value.max;
            }
            return true;
          default:
            return true;
        }
      });
    });

    return {
      items: filtered,
      totalCount: items.length,
      filteredCount: filtered.length,
    };
  }, [items, searchTerm, filterValues, searchFields, filters]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleItemSelect = (item: T, isSelected: boolean) => {
    if (excludeIds.has(item.id)) return;

    const newSelection = new Set(currentSelectedIds);
    if (isSelected) {
      newSelection.add(item.id);
    } else {
      newSelection.delete(item.id);
    }

    setLocalSelectedIds(newSelection);

    if (onSelectionChange) {
      const selectedItems = searchResult.items.filter((item) =>
        newSelection.has(item.id)
      );
      onSelectionChange(selectedItems, newSelection);
    }
  };

  const handleSelectAll = () => {
    const selectableItems = searchResult.items.filter(
      (item) => !excludeIds.has(item.id)
    );
    const allIds = new Set([
      ...currentSelectedIds,
      ...selectableItems.map((item) => item.id),
    ]);

    setLocalSelectedIds(allIds);

    if (onSelectionChange) {
      const selectedItems = items.filter((item) => allIds.has(item.id));
      onSelectionChange(selectedItems, allIds);
    }
  };

  const handleClearAll = () => {
    setLocalSelectedIds(new Set());

    if (onSelectionChange) {
      onSelectionChange([], new Set());
    }
  };

  const renderFilterControl = (filter: SearchFilter) => {
    const value = filterValues[filter.key] || "";

    switch (filter.type) {
      case "text":
        return (
          <FilterInput
            type="text"
            placeholder={filter.placeholder}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      case "select":
        return (
          <FilterSelect
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        );

      case "boolean":
        return (
          <FilterSelect
            value={value}
            onChange={(e) =>
              handleFilterChange(filter.key, e.target.value === "true")
            }
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </FilterSelect>
        );

      default:
        return (
          <FilterInput
            type="text"
            placeholder={filter.placeholder}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );
    }
  };

  const defaultRenderItem = (
    item: T,
    isSelected: boolean,
    isExcluded: boolean
  ) => (
    <DefaultItemContainer
      key={item.id}
      $isSelected={isSelected}
      $isExcluded={isExcluded}
      onClick={() => !isExcluded && handleItemSelect(item, !isSelected)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {allowMultiSelect && isMultiSelectMode && !isExcluded && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              handleItemSelect(item, e.target.checked);
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{ fontWeight: 500, fontSize: "14px", marginBottom: "4px" }}
          >
            {item.name || item.title || item.label || item.id}
          </div>
          {(item.description || item.subtitle) && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {item.description || item.subtitle}
            </div>
          )}
        </div>
        {isExcluded && (
          <div
            style={{ display: "flex", alignItems: "center", color: "#10b981" }}
          >
            <Icon name="success" size="sm" />
          </div>
        )}
      </div>
    </DefaultItemContainer>
  );

  const defaultRenderEmptyState = (searchTerm: string, hasFilters: boolean) => (
    <EmptyState>
      {searchTerm || hasFilters
        ? `No ${itemCountLabel} match your search criteria`
        : `No ${itemCountLabel} available`}
    </EmptyState>
  );

  const hasActiveFilters = Object.values(filterValues).some(
    (value) => value && (!Array.isArray(value) || value.length > 0)
  );

  return (
    <SearchContainer className={className}>
      {/* Search Input */}
      <SearchInputContainer>
        <SearchInputField
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={autoFocus}
        />
        <SearchIcon>
          <Icon name="search" size="sm" />
        </SearchIcon>
      </SearchInputContainer>

      {/* Filters */}
      {filters.length > 0 && (
        <FiltersContainer>
          {filters.map((filter) => (
            <FilterControl key={filter.key}>
              <FilterLabel>{filter.label}</FilterLabel>
              {renderFilterControl(filter)}
            </FilterControl>
          ))}
        </FiltersContainer>
      )}

      {/* Multi-select Controls */}
      {allowMultiSelect && isMultiSelectMode && (
        <SelectionModeBar>
          <div>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              {currentSelectedIds.size} of {searchResult.filteredCount} selected
            </span>
          </div>
          <SelectionActions>
            {renderSelectionControls ? (
              renderSelectionControls(
                currentSelectedIds.size,
                searchResult.filteredCount,
                handleSelectAll,
                handleClearAll
              )
            ) : (
              <>
                <SelectionButton onClick={handleSelectAll}>
                  Select All
                </SelectionButton>
                <SelectionButton onClick={handleClearAll}>
                  Clear
                </SelectionButton>
              </>
            )}
          </SelectionActions>
        </SelectionModeBar>
      )}

      {/* Item Count */}
      {showItemCount && (
        <ItemCountBadge>
          <span>
            {searchResult.filteredCount} of {searchResult.totalCount}{" "}
            {itemCountLabel}
          </span>
          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterValues({});
              }}
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                fontSize: "12px",
                textDecoration: "underline",
              }}
            >
              Clear filters
            </button>
          )}
        </ItemCountBadge>
      )}

      {/* Results */}
      <ResultsContainer $maxHeight={maxHeight}>
        {searchResult.items.length === 0
          ? renderEmptyState
            ? renderEmptyState(searchTerm, hasActiveFilters)
            : defaultRenderEmptyState(searchTerm, hasActiveFilters)
          : searchResult.items.map((item) => {
              const isSelected = currentSelectedIds.has(item.id);
              const isExcluded = excludeIds.has(item.id);

              return renderItem
                ? renderItem(item, isSelected, isExcluded)
                : defaultRenderItem(item, isSelected, isExcluded);
            })}
      </ResultsContainer>
    </SearchContainer>
  );
}

export default Search;
