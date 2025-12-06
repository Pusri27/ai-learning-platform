-- Allow admins to update study groups
create policy "Admins can update study groups"
on study_groups
for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Allow admins to delete study groups
create policy "Admins can delete study groups"
on study_groups
for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
