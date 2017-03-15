from django.db import models


class Person(models.Model):
    first_name = models.CharField(max_length=50)
    birthday = models.DateField()

    def __unicode__(self):
        return self.first_name
