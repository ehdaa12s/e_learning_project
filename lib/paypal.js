export async function loadPayPalSDK(clientId, currency = 'USD') {
  if (window.paypal?.Buttons) return;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const cid = encodeURIComponent(String(clientId || ''));
    script.src = `https://www.paypal.com/sdk/js?components=buttons&client-id=${cid}&currency=${currency}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.paypal?.Buttons) {
        resolve();
      } else {
        reject(new Error('PayPal SDK loaded but Buttons unavailable'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
    document.head.appendChild(script);
  });
}

export async function renderPayPalButton({ containerId, amount, clientId, currency = 'USD', onApprove, onError }) {
  await loadPayPalSDK(clientId, currency);
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container not found: ${containerId}`);

  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{ amount: { value: String(amount) } }]
      });
    },
    onApprove: async (data, actions) => {
      try {
        const details = await actions.order.capture();
        onApprove && onApprove({ data, details });
      } catch (e) {
        console.error('[PayPal] capture failed', e);
        onError && onError(e);
      }
    },
    onError: (err) => {
      console.error('[PayPal] buttons error', err);
      onError && onError(err);
    }
  }).render(`#${containerId}`);
}