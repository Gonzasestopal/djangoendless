from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse, Http404
from django.shortcuts import render

from .models import Person


def index(request):
    """ Redirects to index with paginated queryset. """
    people = Person.objects.all()
    text_search = request.GET.get('text_search', '')

    if text_search:
        people = Person.objects.filter(Q(title__icontains=text_search))

    paginator = Paginator(people, 50)
    page = paginator.page(1)

    if request.is_ajax():
        page = request.GET.get('page', 1)
        try:
            page = paginator.page(page)
        except:
            raise Http404

        results = {'page': page.number, 'hasNext': page.has_next(),
                   'people': [{'first_name': person.first_name,
                               }
                              for person in page.object_list]}
        return JsonResponse(results)

    ctx = {'people': page.object_list, 'text_search': text_search, 'page': page}
    return render(request, 'index.html', ctx)
