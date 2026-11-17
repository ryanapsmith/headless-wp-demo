import { useLocation } from "react-router";
import getConfigForRoute from "../../config";

export const decodeHTMLEntities = (text: string): string => {
  const element = document.createElement('div');
  element.innerHTML = text;
  return element.textContent || '';
};

export function formatIconString(icon: string) {
  return icon.toLowerCase().replace(/\s+/g, '_');
}

export function formatLabel(label: string) {
  const location = useLocation();
  const currentRoute = location.pathname; 
  const { labelOverrides } = getConfigForRoute(currentRoute);

  let labelToFormat = labelOverrides[label] ?? label
  const text = labelToFormat.replace(/^\d+\.\s*/, ''); // removing leading numbers if found
  return decodeHTMLEntities(text);
}