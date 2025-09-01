from django.db import models

class Crop(models.Model):
    name = models.CharField(max_length=100)

class PriceData(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    region = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
