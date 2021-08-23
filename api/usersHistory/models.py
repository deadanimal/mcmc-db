from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
import uuid

class userHistory(models.Model):
    
    historyId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    history_type = models.CharField(max_length=255, blank=True)
    # history_user_id = ArrayField(models.CharField(max_length=255), null=True, blank=True)
    history_user = JSONField()
    history_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
 
    class Meta:
        ordering = ['history_date']

    def __str__(self):
        return self.historyId
