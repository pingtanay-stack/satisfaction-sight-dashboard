import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TripDestination {
  id: string;
  destination_name: string;
  vote_count: number;
  suggested_by_user_id: string;
  user_voted?: boolean;
}

export function useTripDestinations() {
  const [destinations, setDestinations] = useState<TripDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch top destinations with vote counts
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const { data: topDestinations, error } = await supabase
        .rpc('get_top_destinations', { limit_count: 3 });

      if (error) throw error;

      // Get current user's votes
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setDestinations(topDestinations || []);
        return;
      }

      const { data: userVotes, error: votesError } = await supabase
        .from('destination_votes')
        .select('destination_id')
        .eq('user_id', user.id);

      if (votesError) throw votesError;

      const userVoteIds = new Set(userVotes?.map(v => v.destination_id) || []);
      
      const destinationsWithVotes = (topDestinations || []).map(dest => ({
        ...dest,
        user_voted: userVoteIds.has(dest.id)
      }));

      setDestinations(destinationsWithVotes);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load destinations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new destination
  const createDestination = async (name: string) => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to suggest destinations',
          variant: 'destructive',
        });
        return false;
      }

      const { error } = await supabase
        .from('trip_destinations')
        .insert({
          destination_name: name.trim(),
          suggested_by_user_id: user.id
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: `Added "${name}" to dream destinations!`,
      });

      await fetchDestinations();
      return true;
    } catch (error) {
      console.error('Error creating destination:', error);
      toast({
        title: 'Error',
        description: 'Failed to add destination',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle vote for destination
  const toggleVote = async (destinationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to vote',
          variant: 'destructive',
        });
        return;
      }

      const destination = destinations.find(d => d.id === destinationId);
      if (!destination) return;

      if (destination.user_voted) {
        // Remove vote
        const { error } = await supabase
          .from('destination_votes')
          .delete()
          .eq('destination_id', destinationId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: 'Vote removed',
          description: `Removed vote for ${destination.destination_name}`,
        });
      } else {
        // Add vote
        const { error } = await supabase
          .from('destination_votes')
          .insert({
            destination_id: destinationId,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: 'Vote added!',
          description: `Voted for ${destination.destination_name}`,
        });
      }

      await fetchDestinations();
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vote',
        variant: 'destructive',
      });
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchDestinations();

    // Subscribe to changes
    const destinationsChannel = supabase
      .channel('destinations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trip_destinations' }, 
        () => fetchDestinations()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'destination_votes' }, 
        () => fetchDestinations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(destinationsChannel);
    };
  }, []);

  return {
    destinations,
    loading,
    submitting,
    createDestination,
    toggleVote,
    refreshDestinations: fetchDestinations
  };
}