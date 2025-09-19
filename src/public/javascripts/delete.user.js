function deleteButtonClicked(userId, buttonElement) {
  Swal.fire({
    title: 'Weet je het zeker?',
    text: 'Deze klant wordt definitief verwijderd!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ja, verwijderen!',
    cancelButtonText: 'Annuleren'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/users/${userId}`, { method: 'DELETE' });

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Verwijderd!',
            text: 'De klant is succesvol verwijderd.',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            // Verwijder de rij uit de tabel
            const row = buttonElement.closest('tr');
            row.remove();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Fout',
            text: 'Klant verwijderen mislukt.'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Serverfout',
          text: 'Kan geen verbinding maken met de server.'
        });
      }
    }
  });
}
