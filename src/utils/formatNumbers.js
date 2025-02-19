export const addCommas = (number) => {
    try {
      if (number === null || number === undefined || number === '') {
        return '0';
      }
  
      // Convert to number if it's a string
      const num = parseFloat(String(number).replace(/[^0-9.-]/g, ''));
  
      if (isNaN(num)) {
        return '0';
      }
  
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(num);
    } catch (error) {
      console.error('Error in addCommas:', error);
      return '0';
    }
  };
  