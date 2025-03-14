// Store irclickid in localStorage if it exists in the URL
if (window.location.search.includes('irclickid')) {
  const params = new URLSearchParams(window.location.search);
  localStorage.setItem('irclickid', params.get('irclickid'));
  console.log('irclickid found', params.get('irclickid'));
}

// Attach irclickid to all links on the site
document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submit_btn');
  console.log('dom content loaded...', submitButton, localStorage.getItem('irclickid'));

  if (submitButton) {
    submitButton.addEventListener('click', async function () {
      const irclickid = localStorage.getItem('irclickid');

      if (!irclickid) {
        console.warn('No irclickid found in localStorage.');
        return;
      }

      try {
        const response = await fetch('https://your-api.com/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ irclickid }),
        });

        const result = await response.json();
        console.log('API Response:', result);
      } catch (error) {
        console.error('Error sending API request:', error);
      }
    });
  }
});
