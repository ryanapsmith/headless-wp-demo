import React from 'react';
import styled from 'styled-components';

interface TagProps {
    $isSelected: boolean;
    $style?: 'pill' | 'tag';
}

const Tag = styled.span<TagProps>`
    display: block;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: ${({ $style }) => ($style === 'pill' ? '9px 16px' : '5px 10px')};
    border: 1px solid #ccc;
    border-radius: ${({ $style }) => ($style === 'pill' ? '37px' : '3px')};
    cursor: pointer;
    font-size: ${({ $style }) => ($style === 'pill' ? '12px' : '14px')};
    margin: 2px;
    background-color: ${({ $isSelected }) => ($isSelected ? 'var(--tag-background-color-selected, #007bff)' : 'var(--tag-background-color, #007bff)')};
    color: ${({ $isSelected }) => ($isSelected ? 'var(--tag-selected-text-color, #007bff)' : 'var(--tag-text-color, #000)')};
    border-color: ${({ $isSelected }) => ($isSelected ? 'var(--tag-selected-border-color, #ccc)' : 'var(--tag-border-color, #ccc)')};

    &:hover {
        background-color: ${({ $isSelected }) => ($isSelected ? 'var(--tag-selected-background-color-hover, #007bff)' : 'var(--tag-background-color-hover, #f0f0f0)')};
        color: ${({ $isSelected }) => ($isSelected ? 'var(--tag-selected-text-color-hover, #007bff)' : 'var(--tag-text-color-hover, #f0f0f0)')};
    }
`;

Tag.defaultProps = {
    $style: 'tag',
} as Partial<TagProps>;

export default Tag;