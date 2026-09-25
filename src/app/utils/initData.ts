export function initializeDemoData() {
  if (!localStorage.getItem('users')) {
    const demoUsers = [
      {
        id: 1,
        name: 'Demo Client',
        email: 'client@test.com',
        password: 'password',
        role: 'client'
      },
      {
        id: 2,
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password',
        role: 'admin'
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }

  if (!localStorage.getItem('pets')) {
    localStorage.setItem('pets', '[]');
  }

  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', '[]');
  }

  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', '[]');
  }

  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', '[]');
  }
}
