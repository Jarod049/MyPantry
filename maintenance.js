/* MyPantry maintenance UI. All privileged reads and writes go through the
   maintenance Edge Function, which verifies the signed-in user's role again. */
(function () {
  'use strict';

  const config = window.MYPANTRY_CONFIG || {};
  const $ = id => document.getElementById(id);
  const sections = ['loginSection', 'passwordSection', 'pendingSection', 'workspace'];
  const fields = {
    users: [
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'display_name', label: 'Display name', type: 'text', max: 40 }
    ],
    recipes: [
      { key: 'recipe_id', label: 'Recipe ID', type: 'text', required: true, max: 80, hint: 'Lowercase letters, numbers, and hyphens. This cannot change later.' },
      { key: 'name', label: 'Recipe name', type: 'text', required: true, max: 120 },
      { key: 'emoji', label: 'Food emoji', type: 'text', max: 16 },
      { key: 'cuisine', label: 'Cuisine or category', type: 'text', required: true, max: 80 },
      { key: 'main_ingredient', label: 'Main ingredient', type: 'text', required: true, max: 80 },
      { key: 'minutes', label: 'Minutes', type: 'number', required: true, min: 1, max: 240 },
      { key: 'serves', label: 'Servings', type: 'number', required: true, min: 1, max: 24 },
      { key: 'sort_order', label: 'Display order', type: 'number', min: -10000, max: 10000 },
      { key: 'keywords', label: 'Search keywords', type: 'text', wide: true, hint: 'Separate keywords with commas.' },
      { key: 'ingredients', label: 'Ingredients', type: 'textarea', required: true, wide: true, hint: 'One per line: matching name ; amount ; display label. Example: eggs ; 2 ; 2 eggs' },
      { key: 'steps', label: 'Directions', type: 'textarea', required: true, wide: true, hint: 'Write one step per line.' },
      { key: 'substitutions', label: 'Substitutions (optional JSON)', type: 'textarea', wide: true, hint: 'Advanced: use the existing recipe format, or leave blank.' },
      { key: 'video_url', label: 'Video URL', type: 'url', wide: true, hint: 'Optional HTTPS video link.' },
      { key: 'background', label: 'Card background', type: 'text', wide: true, hint: 'Optional hex color such as #dcebd7. Existing recipe gradients can be kept.' },
      { key: 'is_published', label: 'Published in Reels', type: 'checkbox', wide: true }
    ],
    pantry: [
      { key: 'auth_user_id', label: 'Account owner ID', type: 'text', required: true, wide: true, hint: 'Copy this from Maintain Users. The owner must already have an account.' },
      { key: 'ingredient_name', label: 'Food name', type: 'text', required: true, max: 120 },
      { key: 'brand', label: 'Brand', type: 'text', max: 80 },
      { key: 'product_name', label: 'Product name', type: 'text', max: 120 },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true, min: 0.001, step: 'any' },
      { key: 'measurement', label: 'Unit', type: 'select', required: true, options: ['ct', 'oz', 'lb', 'fl oz', 'gal', 'g', 'kg', 'mL', 'L', 'can', 'loaf', 'head', 'bag', 'bulb', 'box', 'jar'] },
      { key: 'food_type', label: 'Food category', type: 'select', required: true, options: ['Fruits', 'Vegetables', 'Meat & Seafood', 'Dairy & Eggs', 'Grains & Bread', 'Snacks', 'Sauces & Condiments', 'Spices & Baking', 'Prepared Meals', 'Drinks', 'Other'] },
      { key: 'storage_location', label: 'Stored in', type: 'select', options: ['Fridge', 'Pantry', 'Freezer'] },
      { key: 'expiration_date', label: 'Use-by date', type: 'date', required: true },
      { key: 'expiration_source', label: 'Date source', type: 'select', options: ['label', 'ai'] },
      { key: 'way_added', label: 'Entry source', type: 'select', options: ['manual', 'barcode', 'receipt', 'pantry_photo'] }
    ]
  };
  const state = { authorized: false, resource: null, page: 1, items: [], hasMore: false, editing: null, client: null, listRequest: 0 };
  const inviteReturn = /(?:^|[?&#])(?:type=invite|type=recovery|access_token=|code=)/.test(window.location.search + window.location.hash);

  function notice(message, error = false) {
    $('notice').textContent = message;
    $('notice').classList.toggle('error', error);
    $('notice').hidden = !message;
  }

  function showOnly(section) {
    for (const id of sections) $(id).hidden = id !== section;
    $('logoutButton').hidden = section === 'loginSection';
  }

  function clearAccess() {
    state.authorized = false;
    state.resource = null;
    state.items = [];
    state.page = 1;
    state.hasMore = false;
    state.editing = null;
    state.listRequest++;
    $('dataPanel').hidden = true;
    $('recordChoices').hidden = true;
    $('recordsBody').replaceChildren();
    if ($('editDialog').open) $('editDialog').close();
    showOnly('loginSection');
  }

  async function api(payload) {
    const { data, error } = await state.client.auth.getSession();
    if (error || !data?.session?.access_token) {
      clearAccess();
      throw new Error('Your session has ended. Please sign in again.');
    }
    const response = await fetch(config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/maintenance-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.supabaseKey,
        Authorization: 'Bearer ' + data.session.access_token
      },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body || !('data' in body)) {
      if (response.status === 401 || response.status === 403) clearAccess();
      throw new Error(body?.error || 'The maintenance service is unavailable. Please try again.');
    }
    return body.data;
  }

  async function verifyRole() {
    const result = await api({ resource: 'session', action: 'status' });
    if (!result?.isAdmin) return false;
    state.authorized = true;
    const { data } = await state.client.auth.getUser();
    $('accountName').textContent = data?.user?.user_metadata?.name || data?.user?.email || 'team member';
    showOnly('workspace');
    notice('');
    return true;
  }

  async function unauthorized(message) {
    clearAccess();
    try { await state.client.auth.signOut({ scope: 'local' }); } catch (_) {}
    notice(message || 'This account does not have maintenance access.', true);
  }

  async function initialize() {
    if (!config.supabaseUrl || !config.supabaseKey || !window.supabase) {
      notice('Sign-in is not configured. Ask the site owner to check the deployment.', true);
      $('loginButton').disabled = true;
      return;
    }
    // A separate storage key keeps this page's session apart from the main app.
    state.client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
      auth: { persistSession: true, storageKey: 'mypantry-maintenance-auth', autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data, error } = await state.client.auth.getSession();
    if (error) {
      notice(error.message, true);
      return;
    }
    if (!data?.session) return;
    if (inviteReturn) {
      showOnly('passwordSection');
      return;
    }
    try {
      if (!(await verifyRole())) await unauthorized('This account does not have maintenance access. Ask the site owner to enable it.');
    } catch (failure) {
      notice(failure.message, true);
    }
  }

  async function signIn(event) {
    event.preventDefault();
    if (!state.client) return;
    const button = $('loginButton');
    button.disabled = true;
    notice('');
    try {
      const email = $('loginEmail').value.trim();
      const password = $('loginPassword').value;
      const { error } = await state.client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      $('loginPassword').value = '';
      if (!(await verifyRole())) await unauthorized('This account does not have maintenance access. Ask the site owner to enable it.');
    } catch (failure) {
      notice(failure.message || 'Sign-in failed.', true);
    } finally {
      button.disabled = false;
    }
  }

  async function setPassword(event) {
    event.preventDefault();
    const password = $('newPassword').value;
    if (password !== $('confirmPassword').value) {
      notice('The passwords do not match.', true);
      return;
    }
    const button = $('setPasswordButton');
    button.disabled = true;
    notice('');
    try {
      const { error } = await state.client.auth.updateUser({ password });
      if (error) throw error;
      $('newPassword').value = '';
      $('confirmPassword').value = '';
      if (!(await verifyRole())) {
        showOnly('pendingSection');
        notice('Password saved. The site owner can now enable this account.');
      }
    } catch (failure) {
      notice(failure.message || 'Password could not be saved.', true);
    } finally {
      button.disabled = false;
    }
  }

  async function logOut() {
    if (!state.client) return;
    const button = $('logoutButton');
    button.disabled = true;
    try {
      const { error } = await state.client.auth.signOut({ scope: 'local' });
      if (error) throw error;
      clearAccess();
      $('loginForm').reset();
      notice('You are logged out. Your maintenance session was removed.');
    } catch (failure) {
      notice(failure.message || 'Could not log out. Please try again.', true);
    } finally {
      button.disabled = false;
    }
  }

  function chooseRecords() {
    if (!state.authorized) return;
    $('recordChoices').hidden = false;
    $('dataPanel').hidden = true;
    $('recordsButton').setAttribute('aria-current', 'page');
    $('usersButton').removeAttribute('aria-current');
  }

  async function chooseResource(resource, page = 1) {
    if (!state.authorized || !fields[resource]) return;
    state.resource = resource;
    state.page = page;
    const request = ++state.listRequest;
    $('dataPanel').hidden = false;
    $('recordChoices').hidden = resource === 'users';
    for (const [id, active] of [
      ['usersButton', resource === 'users'], ['recordsButton', resource !== 'users'],
      ['recipesButton', resource === 'recipes'], ['pantryButton', resource === 'pantry']
    ]) {
      if (active) $(id).setAttribute('aria-current', 'page');
      else $(id).removeAttribute('aria-current');
    }
    const content = {
      users: ['People', 'Users', 'Invite an account, update its name or email, or remove it. Invitations let people set their own password.'],
      recipes: ['Food ideas', 'Recipes', 'Published recipes appear in Reels. New recipes start unpublished until you review them.'],
      pantry: ['Inventory', 'Pantry items', 'These are live food records owned by individual accounts. Date status updates automatically.']
    }[resource];
    $('dataKicker').textContent = content[0];
    $('dataTitle').textContent = content[1];
    $('dataHelp').textContent = content[2];
    $('createButton').textContent = resource === 'users' ? 'Invite user' : resource === 'recipes' ? 'Add recipe' : 'Add pantry item';
    $('listLoading').hidden = false;
    $('listEmpty').hidden = true;
    $('recordsTable').hidden = true;
    $('pagination').hidden = true;
    notice('');
    try {
      const result = await api({ resource, action: 'list', page });
      // Ignore a response from an earlier page or area.
      if (request !== state.listRequest) return;
      state.items = Array.isArray(result?.items) ? result.items : [];
      state.hasMore = !!result?.hasMore;
      renderList();
    } catch (failure) {
      notice(failure.message, true);
      if (/session|access/i.test(failure.message)) clearAccess();
    } finally {
      if (request === state.listRequest) $('listLoading').hidden = true;
    }
  }

  function appendCell(row, content, className = '') {
    const cell = document.createElement('td');
    if (className) cell.className = className;
    if (content instanceof Node) cell.append(content);
    else cell.textContent = content == null ? '' : String(content);
    row.append(cell);
    return cell;
  }

  function titleCell(title, subtitle) {
    const box = document.createElement('div');
    const primary = document.createElement('div');
    primary.className = 'row-title';
    primary.textContent = title || 'Untitled';
    box.append(primary);
    if (subtitle) {
      const secondary = document.createElement('div');
      secondary.className = 'row-subtitle';
      secondary.textContent = subtitle;
      box.append(secondary);
    }
    return box;
  }

  function shortDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
  }

  function renderList() {
    const headings = {
      users: ['Account', 'Confirmed', 'Last sign-in', 'User ID', 'Actions'],
      recipes: ['Recipe', 'Cuisine', 'Time', 'Reels', 'Actions'],
      pantry: ['Food', 'Owner', 'Quantity', 'Use-by date', 'Actions']
    }[state.resource];
    const head = document.createElement('tr');
    for (const heading of headings) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = heading;
      head.append(cell);
    }
    $('recordsHead').replaceChildren(head);
    const body = document.createDocumentFragment();
    for (const item of state.items) {
      const row = document.createElement('tr');
      if (state.resource === 'users') {
        appendCell(row, titleCell(item.email, item.display_name));
        appendCell(row, item.email_confirmed_at ? 'Yes' : 'No');
        appendCell(row, shortDate(item.last_sign_in_at));
        appendCell(row, item.id);
      } else if (state.resource === 'recipes') {
        appendCell(row, titleCell((item.emoji || '🍽️') + ' ' + item.name, item.recipe_id));
        appendCell(row, item.cuisine);
        appendCell(row, item.minutes + ' min');
        const badge = document.createElement('span');
        badge.className = 'badge' + (item.is_published ? '' : ' muted');
        badge.textContent = item.is_published ? 'Published' : 'Hidden';
        appendCell(row, badge);
      } else {
        appendCell(row, titleCell(item.ingredient_name, [item.brand, item.product_name].filter(Boolean).join(' · ')));
        appendCell(row, titleCell(item.owner_email || 'Unknown account', item.auth_user_id));
        appendCell(row, item.quantity + ' ' + item.measurement);
        appendCell(row, shortDate(item.expiration_date));
      }
      const actions = document.createElement('div');
      actions.className = 'row-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'small-button';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => openEditor(state.resource, item));
      actions.append(edit);
      if (state.resource === 'users') {
        const addFood = document.createElement('button');
        addFood.type = 'button';
        addFood.className = 'small-button';
        addFood.textContent = 'Add food';
        addFood.addEventListener('click', () => openEditor('pantry', null, item.id));
        actions.append(addFood);
      }
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'small-button danger';
      remove.textContent = 'Delete';
      remove.disabled = state.resource === 'users' && !!item.is_admin;
      if (remove.disabled) remove.title = 'Maintenance administrators cannot be deleted here.';
      else remove.addEventListener('click', () => deleteItem(state.resource, item));
      actions.append(remove);
      appendCell(row, actions);
      body.append(row);
    }
    $('recordsBody').replaceChildren(body);
    $('listEmpty').hidden = state.items.length > 0;
    $('recordsTable').hidden = state.items.length === 0;
    $('pagination').hidden = state.page === 1 && !state.hasMore;
    $('previousButton').disabled = state.page <= 1;
    $('nextButton').disabled = !state.hasMore;
    $('pageLabel').textContent = 'Page ' + state.page;
  }

  function itemId(resource, item) {
    return resource === 'users' ? item.id : resource === 'recipes' ? item.recipe_id : item.ingredient_id;
  }

  async function deleteItem(resource, item) {
    if (!state.authorized) return;
    const label = resource === 'users' ? item.email : resource === 'recipes' ? item.name : item.ingredient_name;
    if (!window.confirm('Delete ' + label + '? This cannot be undone.')) return;
    notice('');
    try {
      await api({ resource, action: 'delete', id: itemId(resource, item) });
      await chooseResource(resource, state.page);
      notice(label + ' was deleted.');
    } catch (failure) {
      notice(failure.message, true);
    }
  }

  function fieldValue(resource, key, item, ownerId) {
    if (!item) {
      if (key === 'auth_user_id') return ownerId || '';
      if (key === 'sort_order') return '0';
      if (key === 'emoji') return '🍽️';
      if (key === 'measurement') return 'ct';
      if (key === 'food_type') return 'Other';
      if (key === 'storage_location') return 'Pantry';
      if (key === 'expiration_source') return 'label';
      if (key === 'way_added') return 'manual';
      return '';
    }
    const value = item[key];
    if (key === 'keywords') return Array.isArray(value) ? value.join(', ') : '';
    if (key === 'ingredients') return Array.isArray(value) ? value.map(entry => [entry.m, entry.a, entry.label].join(' ; ')).join('\n') : '';
    if (key === 'steps') return Array.isArray(value) ? value.join('\n') : '';
    if (key === 'substitutions') return value ? JSON.stringify(value, null, 2) : '';
    if (key === 'background') return value || '';
    if (key === 'is_published') return !!value;
    return value == null ? '' : String(value);
  }

  function openEditor(resource, item = null, ownerId = '') {
    if (!state.authorized) return;
    state.editing = { resource, item };
    const creating = !item;
    $('editKicker').textContent = creating ? 'New record' : 'Edit record';
    $('editTitle').textContent = (creating ? 'Add ' : 'Edit ') + ({ users: 'user', recipes: 'recipe', pantry: 'pantry item' }[resource]);
    $('editHelp').textContent = resource === 'users'
      ? creating ? 'An invitation email lets the person choose their own password.' : 'The account owner may need to confirm a changed email.'
      : resource === 'recipes' ? 'Save the recipe as unpublished while you review it. Published recipes appear in Reels.'
        : 'Food records belong to an account. Maintenance edits do not count as new food added in the Ingredients tracker.';
    $('editError').hidden = true;
    const container = document.createDocumentFragment();
    for (const descriptor of fields[resource]) {
      if (!creating && ['recipe_id', 'auth_user_id'].includes(descriptor.key)) continue;
      const wrap = document.createElement('div');
      wrap.className = 'field' + (descriptor.wide ? ' wide' : '') + (descriptor.type === 'checkbox' ? ' checkbox' : '');
      const label = document.createElement('label');
      const id = 'field-' + descriptor.key;
      label.htmlFor = id;
      label.textContent = descriptor.label;
      let input;
      if (descriptor.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = descriptor.key === 'ingredients' || descriptor.key === 'steps' ? 6 : 3;
      } else if (descriptor.type === 'select') {
        input = document.createElement('select');
        for (const option of descriptor.options) {
          const element = document.createElement('option');
          element.value = option;
          element.textContent = option.replaceAll('_', ' ');
          input.append(element);
        }
      } else {
        input = document.createElement('input');
        input.type = descriptor.type;
      }
      input.id = id;
      input.name = descriptor.key;
      input.required = !!descriptor.required;
      if (descriptor.max) input.maxLength = descriptor.max;
      if (descriptor.min !== undefined) input.min = String(descriptor.min);
      if (descriptor.max !== undefined && descriptor.type === 'number') input.max = String(descriptor.max);
      if (descriptor.step) input.step = descriptor.step;
      const value = fieldValue(resource, descriptor.key, item, ownerId);
      if (descriptor.type === 'checkbox') input.checked = value;
      else input.value = value;
      wrap.append(label, input);
      if (descriptor.hint) {
        const hint = document.createElement('small');
        hint.textContent = descriptor.hint;
        wrap.append(hint);
      }
      container.append(wrap);
    }
    $('editFields').replaceChildren(container);
    $('saveButton').textContent = creating ? resource === 'users' ? 'Send invitation' : 'Create record' : 'Save changes';
    $('editDialog').showModal();
  }

  function requiredNumber(form, key) {
    const number = Number(form.elements.namedItem(key).value);
    if (!Number.isFinite(number)) throw new Error('Enter a valid number for ' + key.replaceAll('_', ' ') + '.');
    return number;
  }

  function readFields(resource, creating) {
    const form = $('editForm');
    const value = key => form.elements.namedItem(key)?.value.trim() || '';
    if (resource === 'users') return { email: value('email'), display_name: value('display_name') };
    if (resource === 'recipes') {
      const ingredientLines = value('ingredients').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      const ingredients = ingredientLines.map((line, index) => {
        const parts = line.split(';').map(part => part.trim());
        if (parts.length !== 3 || !parts.every(Boolean) || !Number.isFinite(Number(parts[1])) || Number(parts[1]) <= 0) {
          throw new Error('Ingredient ' + (index + 1) + ' must be: matching name ; positive amount ; display label.');
        }
        return { m: parts[0], a: Number(parts[1]), label: parts[2] };
      });
      if (!ingredients.length) throw new Error('Add at least one ingredient.');
      let substitutions = null;
      if (value('substitutions')) {
        try { substitutions = JSON.parse(value('substitutions')); }
        catch { throw new Error('Substitutions must contain valid JSON.'); }
      }
      const result = {
        name: value('name'), emoji: value('emoji') || '🍽️', cuisine: value('cuisine'),
        main_ingredient: value('main_ingredient'), minutes: requiredNumber(form, 'minutes'),
        serves: requiredNumber(form, 'serves'), sort_order: requiredNumber(form, 'sort_order'),
        keywords: value('keywords').split(',').map(word => word.trim()).filter(Boolean),
        ingredients, steps: value('steps').split(/\r?\n/).map(step => step.trim()).filter(Boolean),
        substitutions, video_url: value('video_url') || null, background: value('background') || null,
        is_published: !!form.elements.namedItem('is_published').checked
      };
      if (creating) {
        result.recipe_id = value('recipe_id');
      }
      return result;
    }
    const result = {
      ingredient_name: value('ingredient_name'), brand: value('brand') || null,
      product_name: value('product_name') || null, quantity: requiredNumber(form, 'quantity'),
      measurement: value('measurement'), food_type: value('food_type'),
      expiration_date: value('expiration_date'), storage_location: value('storage_location'),
      expiration_source: value('expiration_source'), way_added: value('way_added')
    };
    if (creating) result.auth_user_id = value('auth_user_id');
    return result;
  }

  async function saveEditor(event) {
    event.preventDefault();
    if (!state.authorized || !state.editing) return;
    const { resource, item } = state.editing;
    const button = $('saveButton');
    button.disabled = true;
    $('editError').hidden = true;
    try {
      const values = readFields(resource, !item);
      const payload = { resource, action: item ? 'update' : 'create', values };
      if (item) payload.id = itemId(resource, item);
      await api(payload);
      $('editDialog').close();
      state.editing = null;
      await chooseResource(resource, state.resource === resource ? state.page : 1);
      notice(item ? 'Record updated.' : resource === 'users' ? 'Invitation sent.' : 'Record created.');
    } catch (failure) {
      $('editError').textContent = failure.message || 'Could not save this record.';
      $('editError').hidden = false;
    } finally {
      button.disabled = false;
    }
  }

  $('loginForm').addEventListener('submit', signIn);
  $('passwordForm').addEventListener('submit', setPassword);
  $('logoutButton').addEventListener('click', logOut);
  $('pendingLogout').addEventListener('click', logOut);
  $('usersButton').addEventListener('click', () => chooseResource('users'));
  $('recordsButton').addEventListener('click', chooseRecords);
  $('recipesButton').addEventListener('click', () => chooseResource('recipes'));
  $('pantryButton').addEventListener('click', () => chooseResource('pantry'));
  $('createButton').addEventListener('click', () => openEditor(state.resource));
  $('previousButton').addEventListener('click', () => chooseResource(state.resource, state.page - 1));
  $('nextButton').addEventListener('click', () => chooseResource(state.resource, state.page + 1));
  $('editForm').addEventListener('submit', saveEditor);
  $('closeDialog').addEventListener('click', () => $('editDialog').close());
  $('cancelEdit').addEventListener('click', () => $('editDialog').close());
  initialize().catch(error => notice(error.message || 'Sign-in is unavailable.', true));
})();
