const DEFAULT_OPTIONS = {
  credentials: 'include',
};

function isJsonResponse(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.includes('application/json');
}

export async function apiFetch(path, options = {}) {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Avoid setting Content-Type when sending FormData so the boundary is set automatically.
  if (
    mergedOptions.body &&
    mergedOptions.body instanceof FormData &&
    mergedOptions.headers &&
    mergedOptions.headers['Content-Type']
  ) {
    // eslint-disable-next-line no-param-reassign
    delete mergedOptions.headers['Content-Type'];
  }

  const response = await fetch(path, mergedOptions);
  let data = null;

  if (isJsonResponse(response)) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export async function apiFetchJson(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const mergedOptions = {
    ...options,
    headers,
  };

  return apiFetch(path, mergedOptions);
}
