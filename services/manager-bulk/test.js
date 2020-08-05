function stringContains(title, query) {
  return title.includes(`${query}`);
}
function getSubCategory(category, title) {
  switch (category) {
    case 'Bedroom':
      if (stringContains(title, 'bed')) {
        return 'Bed';
      } else if (stringContains(title, 'nightstand')) {
        return 'Nightstand';
      } else if (stringContains(title, 'chest')) {
        return 'Chest';
      } else if (stringContains(title, 'dresser')) {
        return 'Dresser';
      } else if (stringContains(title, 'mirror')) {
        return 'Mirror';
      } else {
        return 'Uncategoriezed';
      }

    case 'Dining':
      if (stringContains(title, 'wine')) {
        return 'Wine';
      } else if (stringContains(title, 'table')) {
        return 'Table';
      } else if (stringContains(title, 'chair')) {
        return 'Chair';
      } else if (stringContains(title, 'stool')) {
        return 'Stool';
      } else if (
        stringContains(title, 'buffet') ||
        stringContains(title, 'server')
      ) {
        return 'Buffet';
      } else {
        return 'Uncategoriezed';
      }
    case 'Occasional':
      switch (title) {
        case stringContains(title, 'Coffee'):
          return 'Coffeetable';
        default:
          return 'Uncategoriezed';
      }
    case 'Office':
      switch (title) {
        case stringContains(title, 'Desk'):
          return 'Desk';
        default:
          return 'Uncategoriezed';
      }

    default:
      break;
  }
}

console.log(getSubCategory('Bedroom', '2 drawer nightstand w/ usb'));
