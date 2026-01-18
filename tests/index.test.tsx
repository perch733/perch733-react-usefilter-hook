/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useFilter } from '../src/index';
import { describe, it, expect } from 'vitest';
import React from 'react';

// Mock error component
const ErrorComponent = () => <div>No results found</div>;

describe('useFilter Hook', () => {
  const data = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Orange' },
    { id: 4, name: 'Pineapple' },
    { id: 5, name: 'Café' }, // Test accent
    { id: 6, name: 'Niño' }, // Test n with tilde
  ];

  it('should return all data initially', () => {
    const { result } = renderHook(() => useFilter(data, 'name', <ErrorComponent />));
    expect(result.current.filteredData).toEqual(data);
    expect(result.current.filterText).toBe('');
    expect(result.current.error).toBeNull();
  });

  it('should filter data based on input', () => {
    const { result } = renderHook(() => useFilter(data, 'name', <ErrorComponent />));

    act(() => {
      // Simulate input change
      result.current.handleFilterChange({ target: { value: 'app' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredData).toHaveLength(2); // Apple, Pineapple
    expect(result.current.filteredData.map(item => item.name)).toEqual(['Apple', 'Pineapple']);
    expect(result.current.error).toBeNull();
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useFilter(data, 'name', <ErrorComponent />));

    act(() => {
      result.current.handleFilterChange({ target: { value: 'BANANA' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe('Banana');
  });

  it('should ignore accents/diacritics', () => {
    const { result } = renderHook(() => useFilter(data, 'name', <ErrorComponent />));

    // Search "cafe" should find "Café"
    act(() => {
      result.current.handleFilterChange({ target: { value: 'cafe' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe('Café');

    // Search "nino" should find "Niño"
    act(() => {
      result.current.handleFilterChange({ target: { value: 'nino' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe('Niño');
  });

  it('should show error component when no results found', () => {
    const { result } = renderHook(() => useFilter(data, 'name', <ErrorComponent />));

    act(() => {
      result.current.handleFilterChange({ target: { value: 'xyz' } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.filteredData).toHaveLength(0);
    expect(result.current.error).not.toBeNull();
    // Verify it is the passed component (React element check might need specific matcher or just check existence)
    expect(React.isValidElement(result.current.error)).toBe(true);
  });
  
  it('should handle empty data', () => {
     const { result } = renderHook(() => useFilter([], 'name', <ErrorComponent />));
     expect(result.current.filteredData).toEqual([]);
     expect(result.current.error).toBeNull(); // Initially null because filterText is empty
     
     act(() => {
      result.current.handleFilterChange({ target: { value: 'a' } } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.filteredData).toEqual([]);
    expect(result.current.error).not.toBeNull();
  });
});
