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
  const [allDestinations, setAllDestinations] = useState<TripDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch top destinations with vote counts
  const fetchDestinations = async (limitCount?: number) => {
    setLoading(true);
    try {
      const { data: topDestinations, error } = await supabase
        .rpc('get_top_destinations', { limit_count: limitCount || 3 });

      if (error) throw error;

      // Get current user's votes
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (limitCount) {
          setAllDestinations(topDestinations || []);
        } else {
          setDestinations(topDestinations || []);
        }
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

      // Set appropriate state based on whether it's limited fetch or all
      if (limitCount && limitCount > 10) {
        setAllDestinations(destinationsWithVotes);
      } else {
        setDestinations(destinationsWithVotes);
      }
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

  // Fetch all destinations (not limited to top 3)
  const fetchAllDestinations = async () => {
    await fetchDestinations(100); // Use high limit to get all
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

      // Refresh both lists
      await fetchDestinations();
      await fetchAllDestinations();
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

      // Look for destination in both arrays
      const destination = destinations.find(d => d.id === destinationId) || 
                         allDestinations.find(d => d.id === destinationId);
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

      // Refresh both lists  
      await fetchDestinations();
      await fetchAllDestinations();
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
    fetchAllDestinations();

    // Subscribe to changes
    const destinationsChannel = supabase
      .channel('destinations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trip_destinations' }, 
        () => {
          fetchDestinations();
          fetchAllDestinations();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'destination_votes' }, 
        () => {
          fetchDestinations();
          fetchAllDestinations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(destinationsChannel);
    };
  }, []);

  return {
    destinations,
    allDestinations,
    loading,
    submitting,
    createDestination,
    toggleVote,
    refreshDestinations: fetchDestinations,
    fetchAllDestinations
  };
}