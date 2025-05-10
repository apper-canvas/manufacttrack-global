import * as LucideIcons from "lucide-react";

/**
 * Get icon component by name
 * @param {string} name - Icon name from lucide-react
 * @returns {React.ComponentType<any>} Icon component
 */
const getIcon = (name) => {
  // Use direct lookup from LucideIcons object
  const iconName = name + (name.endsWith('Icon') ? '' : 'Icon');
  const IconComponent = LucideIcons[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon '${name}' not found in lucide-react`);
    return LucideIcons.HelpCircleIcon; // Fallback icon
  }
  
  return IconComponent;
};

export default getIcon;

/**
 * List of commonly used icons in the application:
 * 
 * - LayoutDashboard (Dashboard)
 * - Users (Workforce)
 * - Package (Inventory)
 * - Factory (Production)
 * - CheckCircle (Quality)
 * - TrendingUp (Reports)
 * - Settings (Settings)
 * - Menu (Mobile menu)
 * - Bell (Notifications)
 * - Sun / Moon (Theme toggle)
 * - ChevronDown / ChevronUp (Dropdown)
 * - Plus / Minus (Add/Remove)
 * - Search (Search)
 * - Filter (Filter)
 */