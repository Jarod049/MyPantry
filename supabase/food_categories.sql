-- Accept legacy values for older cached clients; new clients write the 11 categories.
alter table public.pantry_item drop constraint pantry_item_food_type_check;
alter table public.pantry_item add constraint pantry_item_food_type_check check (food_type in (
 'Fruits','Vegetables','Meat & Seafood','Dairy & Eggs','Grains & Bread','Snacks',
 'Sauces & Condiments','Spices & Baking','Prepared Meals','Drinks','Other',
 'Produce','Dairy','Frozen'
));
update public.pantry_item set
 storage_location=case when food_type='Frozen' then coalesce(storage_location,'Freezer') else storage_location end,
 food_type=case
 when food_type='Dairy' then 'Dairy & Eggs'
 when food_type='Produce' then case when lower(ingredient_name) ~ '(apple|banana|berr|orange|peach|pear|grape|lemon|lime|mango|pineapple|melon|avocado)' then 'Fruits' else 'Vegetables' end
 when food_type='Frozen' then case
  when lower(ingredient_name) ~ '(pea|carrot|broccoli|vegetable|spinach|corn)' then 'Vegetables'
  when lower(ingredient_name) ~ '(waffle|bread|bagel)' then 'Grains & Bread'
  when lower(ingredient_name) ~ '(berr|fruit|mango)' then 'Fruits'
  when lower(ingredient_name) ~ '(pizza|meal|lasagna)' then 'Prepared Meals'
  else 'Other' end
 when food_type='Grains & Bread' and lower(ingredient_name) ~ 'flour' and lower(ingredient_name) !~ 'tortilla' then 'Spices & Baking'
 when food_type='Other' then case
  when lower(ingredient_name) ~ '(sauce|salsa|ketchup|mustard|dressing|vinegar|peanut butter)' then 'Sauces & Condiments'
  when lower(ingredient_name) ~ '(flour|sugar|salt|spice|cinnamon|baking)' then 'Spices & Baking'
  when lower(ingredient_name) ~ '(soup|pizza|meal|leftover)' then 'Prepared Meals'
  when lower(ingredient_name) ~ '^(apple|orange|banana)s?$' then 'Fruits'
  else food_type end
 else food_type end
where food_type in ('Produce','Dairy','Frozen','Other','Grains & Bread');
