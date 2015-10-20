require 'rbtree'

class BoundedPriorityQueue
  attr_reader :max_size

  def initialize(max_size)
    super()
    @max_size = max_size
    @rbtree = RBTree.new
  end

  def size
    @rbtree.size
  end

  def push(o)
    if size < max_size
      @rbtree[o] = o
    elsif o > @rbtree.first[1]
      @rbtree.shift
      @rbtree[o] = o
    end
  end

  alias << push

  def pop
    @rbtree.pop[1]
  end

  def top
    @rbtree.last[1]
  end
end
