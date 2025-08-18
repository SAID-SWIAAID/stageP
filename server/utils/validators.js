const validateSupplierUpdate = (updateData) => {
  const allowedFields = [
    'storeName', 'address', 
    'category', 'deliveryEnabled', 'deliveryFee',
    'deliveryRadius', 'minOrderAmount'
  ];
  
  const errors = [];
  const validUpdate = {};
  
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      validUpdate[key] = updateData[key];
    } else {
      errors.push(`Field '${key}' is not allowed for update`);
    }
  });
  
  if (Object.keys(validUpdate).length === 0) {
    errors.push('No valid fields provided for update');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors : null,
    validUpdate
  };
};
const validatePhoneNumber = (phone) => {
  // Validates Moroccan phone numbers: +212 followed by 9 digits
  // Supports both mobile (6,7) and landline (5) prefixes
  const regex = /^\+212[5-7]\d{8}$/;
  return regex.test(phone);
};
module.exports = {
  validateSupplierUpdate,
  validatePhoneNumber
};